import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContainersService {
  apiUrl = process.env.DOCKER_URL || 'http://127.0.0.1:2376';
  constructor(private httpService: HttpService) {}

  pullContainer(container: string, image: string) {
    return this.httpService.post(
      `${this.apiUrl}/containers/create?name=${container}`,
      { Image: image },
    );
  }
  listContainers() {
    return this.httpService.get(`${this.apiUrl}/containers/json`);
  }
  deleteContainer(id: string) {
    return this.httpService.delete(
      `${this.apiUrl}/containers/${id}?force=${true}`,
    );
  }
}
