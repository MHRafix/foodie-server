import { CreateServiceTypeInput } from './create-service-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateServiceTypeInput extends PartialType(CreateServiceTypeInput) {
  @Field(() => Int)
  id: number;
}
