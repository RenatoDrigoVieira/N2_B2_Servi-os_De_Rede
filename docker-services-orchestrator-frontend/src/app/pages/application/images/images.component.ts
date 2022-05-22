import {
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  Subscription,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Dialog } from 'src/app/dialog/dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { MenuService } from 'src/app/services/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent {
  imageForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tag: new FormControl(''),
  });
  dataSource = [];

  displayedColumns: string[] = ['id', 'name', 'action'];

  uploadingImage = false;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService
      .get('images')
      .pipe(take(1))
      .subscribe(
        (values) =>
          (this.dataSource = values
            .filter(
              (value: any) =>
                !value.RepoTags?.[0].includes('grafana') &&
                !value.RepoTags?.[0].includes('prometheus')
            )
            .map((value: any) => {
              return { id: value.Id, name: value.RepoTags?.[0] };
            }))
      );
  }

  ngOnDestroy(): void {}

  createImage() {
    this.uploadingImage = true;
    this.apiService
      .post('images', this.imageForm.getRawValue())
      .pipe(
        take(1),
        switchMap(() =>
          this.apiService.get('images').pipe(
            take(1),
            tap(
              (values) =>
                (this.dataSource = values
                  .filter(
                    (value: any) =>
                      !value.RepoTags?.[0].includes('grafana') &&
                      !value.RepoTags?.[0].includes('prometheus')
                  )
                  .map((value: any) => {
                    return { id: value.Id, name: value.RepoTags?.[0] };
                  }))
            )
          )
        ),
        tap(() => (this.uploadingImage = false)),
        catchError((err: any) => {
          this.uploadingImage = false;
          this.snackbar.open('Falha ao carregar imagem', 'Error', {
            duration: 3000,
          });
          this.cdr.markForCheck();
          return throwError(() => {});
        })
      )
      .subscribe(() => {
        this.cdr.markForCheck();
        this.snackbar.open('Operação concluida com sucesso', 'Success', {
          duration: 3000,
        });
      });
  }

  deleteImage(imageId: string) {
    const dialogRef = this.dialog.open(Dialog, {
      height: '170px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .delete(`images/${imageId}`)
          .pipe(
            take(1),
            switchMap(() =>
              this.apiService.get('images').pipe(
                take(1),
                tap(
                  (values) =>
                    (this.dataSource = values
                      .filter(
                        (value: any) =>
                          !value.RepoTags?.[0].includes('grafana') &&
                          !value.RepoTags?.[0].includes('prometheus')
                      )
                      .map((value: any) => {
                        return { id: value.Id, name: value.RepoTags?.[0] };
                      }))
                )
              )
            ),
            catchError((err: any) => {
              if (err.status === 409) {
                this.snackbar.open(
                  'A imagem esta sendo utilizada por um container ativo',
                  'Error',
                  {
                    duration: 3000,
                  }
                );
              }
              return throwError(() => {});
            })
          )
          .subscribe(() => {
            this.cdr.markForCheck();
            this.snackbar.open('Operação concluida com sucesso', 'Success', {
              duration: 3000,
            });
          });
      }
    });
  }
  removeAllImages() {
    combineLatest([
      ...this.dataSource.map((value: any) =>
        this.apiService.delete(`images/${value.id}`)
      ),
    ])
      .pipe(
        take(1),
        catchError((err: any) => {
          if (err.status === 409) {
            this.snackbar.open(
              'Algumas imagens estão sendo utilizadas por um container ativo',
              'Error',
              {
                duration: 3000,
              }
            );
          }
          return throwError(() => {});
        }),
        switchMap(() =>
          this.apiService.get('images').pipe(
            take(1),
            tap(
              (values) =>
                (this.dataSource = values
                  .filter(
                    (value: any) =>
                      !value.RepoTags?.[0].includes('grafana') &&
                      !value.RepoTags?.[0].includes('prometheus')
                  )
                  .map((value: any) => {
                    return { id: value.Id, name: value.RepoTags?.[0] };
                  }))
            )
          )
        )
      )
      .subscribe(() => {
        this.cdr.markForCheck();
        this.snackbar.open('Operação concluida com sucesso', 'Success', {
          duration: 3000,
        });
      });
  }
}
