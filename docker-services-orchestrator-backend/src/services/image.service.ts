import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  apiUrl = process.env.DOCKER_URL || 'http://127.0.0.1:2376';

  constructor(private httpService: HttpService) {}

  pullImage(image: string) {
    return this.httpService.post(
      `${this.apiUrl}/images/create?fromImage=${image}`,
    );
  }
  listImages() {
    return this.httpService.get(`${this.apiUrl}//images/json`);
  }
  deleteImage(image: string) {
    return this.httpService.delete(`${this.apiUrl}/images/${image}`);
  }
}
