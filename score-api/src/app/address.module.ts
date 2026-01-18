import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './service/address.service';
import { Address, AddressSchema } from './schema/address.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Address.name, schema: AddressSchema }],
      'estore'
    ),
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
