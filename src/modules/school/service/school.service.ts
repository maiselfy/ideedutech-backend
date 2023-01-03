import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Address, PrismaService, School } from 'src/modules/prisma';
import { S3Service } from 'src/utils/bucket-s3';
import { FindSchoolByRegionDTO } from '../dtos/findSchoolByRegion.dto';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}
  async create(createSchoolDTO) {
    const data = createSchoolDTO;

    const createdSchool = await this.prisma.school.create({
      data: {
        ...data,
        address: {
          create: data.address,
        },
      },
      include: {
        address: true,
      },
    });

    if (!createdSchool) {
      throw new HttpException(
        'Não foi possível criar a escola, por favor tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: createdSchool,
      status: HttpStatus.CREATED,
      message: 'Escola cadastrada com sucesso.',
    };
  }

  async findAll(managerId: string) {
    const currentManager = await this.prisma.manager.findUnique({
      where: {
        userId: managerId,
      },
    });

    if (!currentManager) {
      throw new HttpException(
        'Acesso negado. O gestor não está cadastrado a esta escola.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const schools = await this.prisma.manager.findFirst({
      select: {
        schools: {
          include: {
            address: {
              select: {
                city: true,
                area: true,
                createdAt: true,
                number: true,
                labelAddress: true,
                uf: true,
                street: true,
              },
            },
            _count: {
              select: { managers: true, teachers: true, students: true },
            },
          },
        },
      },
      where: { userId: managerId },
    });

    if (!schools) {
      throw new HttpException(
        {
          error: 'Não existem escolas registradas em nossa base de dados.',
          code: 'Teste',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: schools,
      status: HttpStatus.OK,
      message: 'Escolas retornadas com sucesso.',
    };
  }

  async findAllByAdmin(findSchoolByRegionDTO: FindSchoolByRegionDTO) {
    const { city, uf } = findSchoolByRegionDTO;

    const schools = await this.prisma.school.findMany({
      where: {
        address: {
          some: {
            city: city ? city : undefined,
            uf: uf ? uf.toUpperCase() : undefined,
          },
        },
      },
      include: {
        address: {
          select: {
            city: true,
            area: true,
            createdAt: true,
            number: true,
            labelAddress: true,
            uf: true,
            street: true,
          },
        },
        _count: {
          select: { managers: true, teachers: true, students: true },
        },
      },
    });

    if (!schools) {
      throw new HttpException(
        {
          error: 'Não existem escolas registradas em nossa base de dados.',
          code: 'Teste',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: schools,
      status: HttpStatus.OK,
      message: 'Escolas retornadas com sucesso.',
    };
  }

  async findCitiesBySchools() {
    const cities = await this.prisma.$queryRaw<
      Address[]
    >`SELECT DISTINCT a.city FROM public."Address" a where a."schoolId" is not null`;

    const formattedData = cities.map((address) => {
      return address.city;
    });

    return {
      data: formattedData,
      message: 'Munícipios retornados com sucesso.',
      status: HttpStatus.OK,
    };
  }

  async findSchoolById(id: string) {
    const response = await this.prisma.school.findFirst({
      where: {
        id,
      },
    });

    if (!response) {
      throw new HttpException(
        'School not found in yours schools',
        HttpStatus.BAD_GATEWAY,
      );
    }
    return {
      data: response,
      status: HttpStatus.OK,
      message: 'Escola retornada com sucesso.',
    };
  }

  async update(id, updateInfoSchool) {
    try {
      const updateData = updateInfoSchool;

      const updateSchool = await this.prisma.school.findUnique({
        where: {
          id: id,
        },
      });

      updateSchool.name = updateData.name ? updateData.name : updateSchool.name;
      updateSchool.cnpj = updateData.cnpj ? updateData.cnpj : updateSchool.cnpj;
      updateSchool.phone = updateData.phone
        ? updateData.phone
        : updateSchool.phone;
      updateSchool.email = updateData.email
        ? updateData.email
        : updateSchool.email;
      updateSchool.inep = updateData.inep ? updateData.inep : updateSchool.inep;

      await this.prisma.school.update({
        where: {
          id: id,
        },
        data: {
          name: updateSchool.name,
          cnpj: updateSchool.cnpj,
          phone: updateSchool.phone,
          email: updateSchool.email,
          inep: updateSchool.inep,
        },
      });

      if (updateData.address) {
        const updateAddress = await this.prisma.address.findFirst({
          where: {
            schoolId: updateSchool.id,
          },
        });

        updateAddress.street = updateData.address.street
          ? updateData.address.street
          : updateAddress.street;
        updateAddress.city = updateData.address.city
          ? updateData.address.city
          : updateAddress.city;
        updateAddress.number = updateData.address.number
          ? updateData.address.number
          : updateAddress.number;
        updateAddress.zipCode = updateData.address.zipCode
          ? updateData.address.zipCode
          : updateAddress.zipCode;
        updateAddress.area = updateData.address.area
          ? updateData.address.area
          : updateAddress.area;
        updateAddress.uf = updateData.address.uf
          ? updateData.address.uf
          : updateAddress.uf;
        updateAddress.labelAddress = updateData.address.labelAddress
          ? updateData.address.labelAddress
          : updateAddress.labelAddress;

        await this.prisma.address.update({
          where: {
            id: updateAddress.id,
          },
          data: {
            street: updateAddress.street,
            city: updateAddress.city,
            number: updateAddress.number,
            zipCode: updateAddress.zipCode,
            area: updateAddress.area,
            uf: updateAddress.uf,
            labelAddress: updateAddress.labelAddress,
          },
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Escola atualizada com sucesso.',
      };
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateAvatar(schoolId, avatar) {
    const s3Service = new S3Service();

    const avatarSaved = await s3Service.uploadFile(avatar);
    if (!avatarSaved) {
      throw new Error('Failure saving avatar in bucket');
    }
    const { Location: url } = avatarSaved;

    try {
      const responseUpdateAvatar = await this.prisma.school.update({
        where: {
          id: schoolId,
        },
        data: {
          avatar: url,
        },
      });

      if (!responseUpdateAvatar) {
        throw new Error('Avatar update failure');
      }
      return {
        data: responseUpdateAvatar.avatar,
        status: HttpStatus.OK,
        message: 'Avatar atualizado com sucesso.',
      };
    } catch (e) {
      console.log(e);
      throw new Error('Avatar update failure');
    }
  }

  async findAllPeriod(schoolId: string) {
    const period = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      select: {
        Period: {
          select: {
            name: true,
            startOfPeriod: true,
            endOfPeriod: true,
            schedule: {
              distinct: ['disciplineId'],
              select: {
                discipline: {
                  select: {
                    name: true,
                    homeWorks: {
                      select: {
                        name: true,
                        description: true,
                        evaluativeDelivery: {
                          select: {
                            rate: true,
                            updatedAt: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return period;
  }
}
