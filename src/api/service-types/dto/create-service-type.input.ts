import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { SERVICE_STATUS } from '../entities/service-type.entity';

@InputType()
export class CreateServiceTypeInput {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description: string;

  @Field(() => SERVICE_STATUS, { defaultValue: SERVICE_STATUS.PUBLISHED })
  @IsOptional()
  status: SERVICE_STATUS;

  @Field(() => String, { nullable: true })
  @IsOptional()
  image: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  itemsCount: number;
}
