import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectEntity, ObjectSchema } from './schemas/object.schema';
import { S3Service } from '../s3/s3.service';
import { ObjectsGateway } from './objects.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ObjectEntity.name, schema: ObjectSchema },
    ]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, S3Service, ObjectsGateway],
})
export class ObjectsModule {}