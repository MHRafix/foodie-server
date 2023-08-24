import { GqlAuthGuard } from '@/src/app/config/jwtGqlGuard';
import { CommonMatchInput } from '@/src/shared/dto/CommonFindOneDto';
import { mongodbFindObjectBuilder } from '@/src/shared/utils/filterBuilder';
import getGqlFields from '@/src/shared/utils/get-gql-fields';
import {
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateServiceTypeInput } from './dto/create-service-type.input';
import { ServiceTypesListQueryDto } from './dto/service-types-list.input';
import { UpdateServiceTypeInput } from './dto/update-service-type.input';
import {
  ServiceTypes,
  ServiceTypesPagination,
} from './entities/service-type.entity';
import { ServiceTypesService } from './service-types.service';

@Resolver(() => ServiceTypes)
export class ServiceTypesResolver {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Mutation(() => Boolean)
  async createServiceType(@Args('payload') payload: CreateServiceTypeInput) {
    try {
      await this.serviceTypesService.create(payload);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Query(() => ServiceTypesPagination, { name: ServiceTypes.name })
  @UseGuards(GqlAuthGuard)
  findAll(
    @Args('payload', { nullable: true }) payload: ServiceTypesListQueryDto,
    @Info() info: any,
  ) {
    try {
      const fields = getGqlFields(info, 'nodes');
      return this.serviceTypesService.findAll(payload, fields);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Query(() => ServiceTypes, { name: 'serviceType' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('payload') payload: CommonMatchInput) {
    try {
      const find = mongodbFindObjectBuilder(payload);
      return this.serviceTypesService.findOne(find);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateServiceType(@Args('payload') payload: UpdateServiceTypeInput) {
    try {
      await this.serviceTypesService.update(payload._id, payload);
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeServiceType(@Args('payload') payload: CommonMatchInput) {
    try {
      const find = mongodbFindObjectBuilder(payload);
      const res = await this.serviceTypesService.remove(find);
      return res.deletedCount > 0;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
