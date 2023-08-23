import { GqlAuthGuard } from '@/src/app/config/jwtGqlGuard';
import getGqlFields from '@/src/shared/utils/get-gql-fields';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Mutation(() => ServiceTypes)
  createServiceType(@Args('payload') payload: CreateServiceTypeInput) {
    try {
      return this.serviceTypesService.create(payload);
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
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.serviceTypesService.findOne(id);
  }

  @Mutation(() => ServiceTypes)
  updateServiceType(
    @Args('updateServiceTypeInput')
    updateServiceTypeInput: UpdateServiceTypeInput,
  ) {
    return this.serviceTypesService.update(
      updateServiceTypeInput.id,
      updateServiceTypeInput,
    );
  }

  @Mutation(() => ServiceTypes)
  removeServiceType(@Args('id', { type: () => Int }) id: number) {
    return this.serviceTypesService.remove(id);
  }
}
