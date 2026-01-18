import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, AddressDocument } from '../schema/address.schema';
import { CreateAddressDto, UpdateAddressDto, AddressResponseDto } from '../dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name, 'estore') private addressModel: Model<AddressDocument>,
  ) {}

  async createAddress(
    userId: string,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    // If this address is marked as default, unset other default addresses
    if (createAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId) },
        { isDefault: false },
      );
    }

    const newAddress = new this.addressModel({
      userId: new Types.ObjectId(userId),
      ...createAddressDto,
    });

    const savedAddress = await newAddress.save();

    return {
      id: savedAddress._id.toString(),
      fullName: savedAddress.fullName,
      phone: savedAddress.phone,
      addressLine1: savedAddress.addressLine1,
      addressLine2: savedAddress.addressLine2,
      city: savedAddress.city,
      state: savedAddress.state,
      pincode: savedAddress.pincode,
      country: savedAddress.country,
      isDefault: savedAddress.isDefault,
      createdAt: savedAddress.createdAt,
    };
  }

  async getAddresses(userId: string): Promise<AddressResponseDto[]> {
    const addresses = await this.addressModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 })
      .exec();

    return addresses.map((address) => ({
      id: address._id.toString(),
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
    }));
  }

  async getAddressById(userId: string, addressId: string): Promise<AddressResponseDto> {
    const address = await this.addressModel
      .findOne({
        _id: new Types.ObjectId(addressId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return {
      id: address._id.toString(),
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
    };
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    // If this address is being set as default, unset other defaults
    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { userId: new Types.ObjectId(userId) },
        { isDefault: false },
      );
    }

    const address = await this.addressModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(addressId),
          userId: new Types.ObjectId(userId),
        },
        { $set: updateAddressDto },
        { new: true },
      )
      .exec();

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return {
      id: address._id.toString(),
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt,
    };
  }

  async deleteAddress(userId: string, addressId: string): Promise<{ message: string }> {
    const result = await this.addressModel
      .findOneAndDelete({
        _id: new Types.ObjectId(addressId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!result) {
      throw new NotFoundException('Address not found');
    }

    return { message: 'Address deleted successfully' };
  }
}
