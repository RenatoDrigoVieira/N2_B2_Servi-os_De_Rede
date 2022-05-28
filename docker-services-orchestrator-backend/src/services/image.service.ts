import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class ImagesService {
  apiUrl = process.env.DOCKER_URL || 'http://localhost:8093';

  constructor(private httpService: HttpService) {}

  pullImage(image: string, tag: string) {
    return this.httpService
      .post(
        `${this.apiUrl}/images/create?fromImage=${image}&tag=${
          tag ?? 'latest'
        }`,
      )
      .pipe(
        map((resp) => {
          return { status: 'Concluido' };
        }),
      );
  }
  listImages() {
    return this.httpService
      .get(`${this.apiUrl}/images/json`)
      .pipe(map((resp) => resp.data));
  }
  deleteImage(image: string) {
    return this.httpService.delete(`${this.apiUrl}/images/${image}`).pipe(
      map((resp) => resp.data),
      catchError(() => {
        throw new HttpException(
          'Essa imagem esta sendo usada por um container ativo',
          HttpStatus.CONFLICT,
        );
      }),
    );
  }
}
