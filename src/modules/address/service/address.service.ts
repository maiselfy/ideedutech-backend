import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateAddressDTO from '../dtos/createAddress.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService){}
  async create(createAddressDTO: CreateAddressDTO) {
    const data = createAddressDTO;
    
    const createdAddress = await this.prisma.address.create({ data });  
  
    return {
      data: createdAddress,
      status: HttpStatus.CREATED,
      message: 'Endereço cadastrado com sucesso.'
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
