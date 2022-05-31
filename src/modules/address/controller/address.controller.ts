import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateAddressDTO from '../dtos/createAddress.dto';
import { AddressService } from '../service/address.service';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Public()
  @Post()
  create(@Body() createAddressDTO: CreateAddressDTO) {
    return this.addressService.create(createAddressDTO);
  }

  // @Get()
  // findAll() {
  //   return this.addressService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.addressService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
  //   return this.addressService.update(+id, updateAddressDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.addressService.remove(+id);
  // }
}
