import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectEntity, ObjectDocument } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Service } from '../s3/s3.service';
import { ObjectsGateway } from './objects.gateway';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectEntity.name)
    private objectModel: Model<ObjectDocument>,
    private s3Service: S3Service,
    private gateway: ObjectsGateway,
  ) {}

  async create(dto: CreateObjectDto, file: Express.Multer.File): Promise<ObjectDocument> {
    const { url, key } = await this.s3Service.uploadFile(file);

    const created = new this.objectModel({
      title: dto.title,
      description: dto.description,
      imageUrl: url,
      imageKey: key,
    });

    const saved = await created.save();

    this.gateway.emitObjectCreated(saved);

    return saved;
  }

  async findAll(): Promise<ObjectDocument[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ObjectDocument> {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) throw new NotFoundException(`Objet ${id} introuvable`);
    return obj;
  }

  async remove(id: string): Promise<{ message: string }> {
    const obj = await this.findOne(id);
    await this.s3Service.deleteFile(obj.imageKey);
    await this.objectModel.findByIdAndDelete(id).exec();
    return { message: 'Objet supprimé avec succès' };
  }
}