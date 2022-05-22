import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { LoadImageDto } from 'src/dto/image.dto';
import { ImagesService } from 'src/services/image.service';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}
  @Post()
  loadImage(@Body() loadImageDto: LoadImageDto) {
    return this.imagesService.pullImage(loadImageDto.name);
  }

  @Get()
  getAllImages() {
    return this.imagesService.listImages();
  }

  @Delete()
  removeAllImages() {
    return `This action removes a  cat`;
  }

  @Delete(':id')
  removeImage(@Param('id') id: string) {
    return this.imagesService.deleteImage(id);
  }
}
