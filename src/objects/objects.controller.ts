import {
  Controller, Get, Post, Delete,
  Param, Body, UploadedFile,
  UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';

const imageFilter = (_req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
    return cb(new BadRequestException('Seules les images sont acceptées'), false);
  }
  cb(null, true);
};

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: imageFilter,
  }))
  async create(
    @Body() dto: CreateObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image obligatoire');
    return this.objectsService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objectsService.remove(id);
  }
}