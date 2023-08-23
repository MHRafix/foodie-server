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
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { User, UserPagination } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  signUp(@Args('payload') payload: CreateUserInput) {
    try {
      return this.usersService.signup(payload);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Mutation(() => User)
  async signIn(@Args('payload') payload: CreateUserInput) {
    try {
      return this.usersService.signin(payload);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  @Mutation(() => User)
  async adminSignIn(@Args('payload') payload: CreateUserInput) {
    try {
      return this.usersService.adminSignin(payload);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Query(() => UserPagination, { name: 'users' })
  @UseGuards(GqlAuthGuard)
  findAll(
    @Args('payload', { nullable: true }) payload: UserListQueryDto,
    @Info() info: any,
  ) {
    try {
      const fields = getGqlFields(info, 'nodes');
      return this.usersService.findAll(payload, fields);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('payload') payload: CommonMatchInput) {
    try {
      const find = mongodbFindObjectBuilder(payload);
      return this.usersService.findOne(find);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args('payload') payload: UpdateUserInput) {
    try {
      await this.usersService.update(payload._id, payload);
      return this.usersService.findOne({ _id: payload._id });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeUser(@Args('payload') payload: CommonMatchInput) {
    try {
      const find = mongodbFindObjectBuilder(payload);
      const res = await this.usersService.remove(find);
      return res.deletedCount > 0;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async bulkRemoveUser(@Args('uIds', { type: () => [String] }) uIds: string[]) {
    try {
      const res = await this.usersService.removeBulk(uIds);
      return res.deletedCount > 0;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
