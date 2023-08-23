import { Paginated } from '@/src/shared/object-types/paginationObject';
import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceTypesDocument = ServiceTypes & Document;

export enum SERVICE_STATUS {
  PUBLISHED = 'PUBLISHED',
  BLOCKED = 'BLOCKED',
  PAUSED = 'PAUSED',
}

registerEnumType(SERVICE_STATUS, {
  name: 'SERVICE_STATUS',
});

@ObjectType()
@Schema({ timestamps: true })
export class ServiceTypes {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Prop({ required: false })
  @Field(() => String, { nullable: true })
  name: string;

  @Prop({ required: false })
  @Field(() => String, { nullable: true })
  description: string;

  @Prop({ default: SERVICE_STATUS.PUBLISHED })
  @Field(() => SERVICE_STATUS, { defaultValue: SERVICE_STATUS.PUBLISHED })
  status: SERVICE_STATUS;

  @Prop({
    required: false,
    default:
      'https://res.cloudinary.com/coderxone/image/upload/v1692805560/tii88l4dkfkfgjxxltdt.png',
  })
  @Field(() => String, { nullable: true })
  image: string;

  @Prop()
  @Field(() => Int, { nullable: true })
  itemsCount: number;
}

export const ServiceTypesSchema = SchemaFactory.createForClass(ServiceTypes);

@ObjectType()
export class ServiceTypesPagination extends Paginated(ServiceTypes) {}
