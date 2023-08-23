import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceTypes,
  ServiceTypesSchema,
} from './entities/service-type.entity';
import { ServiceTypesResolver } from './service-types.resolver';
import { ServiceTypesService } from './service-types.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: ServiceTypes.name, schema: ServiceTypesSchema },
    ]),
  ],
  providers: [ServiceTypesResolver, ServiceTypesService],
})
export class ServiceTypesModule {}
