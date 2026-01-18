import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AddressService } from '../service/address.service';
import { CreateAddressDto, UpdateAddressDto, AddressResponseDto } from '../dto/address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAddress(
    @Request() req,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressService.createAddress(req.user.userId, createAddressDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAddresses(@Request() req): Promise<AddressResponseDto[]> {
    return this.addressService.getAddresses(req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAddressById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<AddressResponseDto> {
    return this.addressService.getAddressById(req.user.userId, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAddress(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressService.updateAddress(req.user.userId, id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAddress(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.addressService.deleteAddress(req.user.userId, id);
  }
}
