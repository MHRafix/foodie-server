import { AppPaginationResponse } from '@/src/shared/contracts/app-pagination-response';
import { SortType } from '@/src/shared/dto/CommonPaginationDto';
import { filterBuilder } from '@/src/shared/utils/filterBuilder';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceTypeInput } from './dto/create-service-type.input';
import { ServiceTypesListQueryDto } from './dto/service-types-list.input';
import { UpdateServiceTypeInput } from './dto/update-service-type.input';
import {
  ServiceTypes,
  ServiceTypesDocument,
} from './entities/service-type.entity';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectModel(ServiceTypes.name)
    private serviceTypesModel: Model<ServiceTypesDocument>, // private jwtService: JwtService,
  ) {}

  create(payload: CreateServiceTypeInput) {
    return this.serviceTypesModel.create(payload);
  }

  /**
   * get all service types
   * @returns
   */
  async findAll(input: ServiceTypesListQueryDto, fields: string[] = []) {
    const { page = 1, limit = 10 } = input;
    const where = filterBuilder(input.filters, input.filterOperator);

    const cursor = this.serviceTypesModel.find(where);
    const count = await this.serviceTypesModel.countDocuments(where);
    const skip = (page - 1) * limit;
    const data = await cursor
      .sort({ [input?.sortBy]: input?.sort == SortType.DESC ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    return new AppPaginationResponse(data, {
      totalCount: count,
      currentPage: page,
      hasNextPage: page * limit < count,
      totalPages: Math.ceil(count / limit),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceType`;
  }

  update(id: number, updateServiceTypeInput: UpdateServiceTypeInput) {
    return `This action updates a #${id} serviceType`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceType`;
  }
}
