import { AppPaginationResponse } from '@/src/shared/contracts/app-pagination-response';
import { SortType } from '@/src/shared/dto/CommonPaginationDto';
import { filterBuilder } from '@/src/shared/utils/filterBuilder';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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

  /**
   * get single serviceTypes
   * @param _id single serviceTypes id
   * @returns
   */
  async findOne(
    filter: FilterQuery<ServiceTypesDocument>,
    fields: string[] = [],
  ) {
    try {
      const data = await this.serviceTypesModel.findOne(filter);

      if (!data) {
        throw new ForbiddenException('Data is not found');
      }
      return data;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }

  /**
   * update service
   * @param _id service id
   * @param input update payload
   * @returns
   */
  update(_id: string, updateUserInput: UpdateServiceTypeInput) {
    return this.serviceTypesModel.findOneAndUpdate({ _id }, updateUserInput);
  }

  /**
   * delete user
   * @param filter
   * @returns
   */
  remove(filter: FilterQuery<ServiceTypesDocument>) {
    return this.serviceTypesModel.deleteOne(filter);
  }
}
