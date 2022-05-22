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
import { LoadContainerDto } from 'src/dto/container.dto';
import { ContainersService } from 'src/services/container.service';

@Controller('containers')
export class ContainersController {
  constructor(private containersService: ContainersService) {}
  @Post()
  loadContainer(@Body() loadContainerDto: LoadContainerDto) {
    return this.containersService.pullContainer(
      loadContainerDto.name,
      loadContainerDto.image,
    );
  }

  @Get()
  getAllContainer() {
    return this.containersService.listContainers();
  }

  @Delete()
  removeAllContainers() {
    return `This action removes a cat`;
  }

  @Delete(':id')
  removeContainer(@Param('id') id: string) {
    return this.containersService.deleteContainer(id);
  }
}
