import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import CreateAddressDTO from '../dtos/createAddress.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}
  async create(createAddressDTO) {
    const data = createAddressDTO;

    const createdAddress = await this.prisma.address.create({ data });

    if (!createdAddress) {
      throw new HttpException(
        `Informações inválidas para o endereço, não foi possível prosseguir com a criação.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: createdAddress,
      status: HttpStatus.CREATED,
      message: 'Endereço cadastrado com sucesso.',
    };
  }

  // findAll() {
  //   return `This action returns all address`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} address`;
  // }

  // update(id: number, updateAddressDto: UpdateAddressDto) {
  //   return `This action updates a #${id} address`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} address`;
  // }
}
