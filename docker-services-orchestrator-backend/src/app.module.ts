import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContainersController } from './controllers/container.controller';
import { ImagesController } from './controllers/image.controller';
import { ContainersService } from './services/container.service';
import { ImagesService } from './services/image.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, ImagesController, ContainersController],
  providers: [AppService, ImagesService, ContainersService],
})
export class AppModule {}
