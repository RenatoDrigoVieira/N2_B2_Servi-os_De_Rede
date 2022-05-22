import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ContainersService {
  apiUrl = process.env.DOCKER_URL || 'http://18.230.11.1:8093';
  constructor(private httpService: HttpService) {}

  pullContainer(container: string, image: string) {
    return this.httpService
      .post(`${this.apiUrl}/containers/create?name=${container}`, {
        Image: image,
      })
      .pipe(
        map((resp) => {
          return { status: 'Concluido' };
        }),
      );
  }
  listContainers() {
    return this.httpService
      .get(`${this.apiUrl}/containers/json?all=true`)
      .pipe(map((resp) => resp.data));
  }

  startContainer(id: string) {
    return this.httpService
      .post(`${this.apiUrl}/containers/${id}/start`)
      .pipe(map((resp) => resp.data));
  }
  stopContainer(id: string) {
    return this.httpService
      .post(`${this.apiUrl}/containers/${id}/stop`)
      .pipe(map((resp) => resp.data));
  }
  deleteContainer(id: string) {
    return this.httpService
      .delete(`${this.apiUrl}/containers/${id}?force=${true}`)
      .pipe(map((resp) => resp.data));
  }
}
