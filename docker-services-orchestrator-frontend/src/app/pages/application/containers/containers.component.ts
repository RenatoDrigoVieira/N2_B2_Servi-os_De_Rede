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
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss'],
})
export class ContainersComponent {
  containerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });
  dataSource = [{ id: '1', name: 'teste' }];
  images: any[] = [];
  uploadingContainer = false;
  displayedColumns: string[] = ['id', 'name', 'image', 'status', 'action'];

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService
      .get('containers')
      .pipe(take(1))
      .subscribe(
        (values) =>
          (this.dataSource = values
            .filter(
              (value: any) =>
                value.Names?.[0] !== '/grafana' &&
                value.Names?.[0] !== '/prometheus'
            )
            .map((value: any) => {
              return {
                id: value.Id,
                name: value.Names?.[0],
                image: value.Image,
                state: value.State,
              };
            }))
      );

    this.apiService
      .get('images')
      .pipe(take(1))
      .subscribe(
        (values) =>
          (this.images = values.map((value: any) => {
            return { id: value.Id, name: value.RepoTags?.[0] };
          }))
      );
  }

  ngOnDestroy(): void {}

  createContainer() {
    this.uploadingContainer = true;
    this.apiService
      .post('containers', this.containerForm.getRawValue())
      .pipe(
        take(1),
        switchMap(() =>
          this.apiService.get('containers').pipe(
            take(1),
            tap(
              (values) =>
                (this.dataSource = values
                  .filter(
                    (value: any) =>
                      value.Names?.[0] !== '/grafana' &&
                      value.Names?.[0] !== '/prometheus'
                  )
                  .map((value: any) => {
                    return {
                      id: value.Id,
                      name: value.Names?.[0],
                      image: value.Image,
                      state: value.State,
                    };
                  }))
            )
          )
        ),
        tap(() => (this.uploadingContainer = false)),
        catchError((err: any) => {
          this.uploadingContainer = false;
          this.snackbar.open('Falha ao criar container', 'Error', {
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

  deleteContainer(containerId: string) {
    const dialogRef = this.dialog.open(Dialog, {
      height: '170px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiService
          .delete(`containers/${containerId}`)
          .pipe(
            take(1),
            switchMap(() =>
              this.apiService.get('containers').pipe(
                take(1),
                tap(
                  (values) =>
                    (this.dataSource = values
                      .filter(
                        (value: any) =>
                          value.Names?.[0] !== '/grafana' &&
                          value.Names?.[0] !== '/prometheus'
                      )
                      .map((value: any) => {
                        return {
                          id: value.Id,
                          name: value.Names?.[0],
                          image: value.Image,
                          state: value.State,
                        };
                      }))
                )
              )
            ),
            catchError((err: any) => {
              this.snackbar.open('Falha ao excluir container', 'Error', {
                duration: 3000,
              });
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

  removeAllContainers() {
    combineLatest([
      ...this.dataSource.map((value: any) =>
        this.apiService.delete(`containers/${value.id}`)
      ),
    ])
      .pipe(
        take(1),
        catchError((err: any) => {
          this.snackbar.open('Falha ao excluir container', 'Error', {
            duration: 3000,
          });
          return throwError(() => {});
        }),
        switchMap(() =>
          this.apiService.get('containers').pipe(
            take(1),
            tap(
              (values) =>
                (this.dataSource = values
                  .filter(
                    (value: any) =>
                      value.Names?.[0] !== '/grafana' &&
                      value.Names?.[0] !== '/prometheus'
                  )
                  .map((value: any) => {
                    return {
                      id: value.Id,
                      name: value.Names?.[0],
                      image: value.Image,
                      state: value.State,
                    };
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

  startContainer(containerId: string) {
    this.apiService
      .post(`containers/start/${containerId}`)
      .pipe(
        take(1),
        switchMap(() =>
          this.apiService.get('containers').pipe(
            take(1),
            tap(
              (values) =>
                (this.dataSource = values
                  .filter(
                    (value: any) =>
                      value.Names?.[0] !== '/grafana' &&
                      value.Names?.[0] !== '/prometheus'
                  )
                  .map((value: any) => {
                    return {
                      id: value.Id,
                      name: value.Names?.[0],
                      image: value.Image,
                      state: value.State,
                    };
                  }))
            )
          )
        ),
        catchError((err: any) => {
          this.snackbar.open('Falha ao iniciar container', 'Error', {
            duration: 3000,
          });
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
  stopContainer(containerId: string) {
    this.apiService
      .post(`containers/stop/${containerId}`)
      .pipe(
        take(1),
        switchMap(() =>
          this.apiService.get('containers').pipe(
            take(1),
            tap(
              (values) =>
                (this.dataSource = values
                  .filter(
                    (value: any) =>
                      value.Names?.[0] !== '/grafana' &&
                      value.Names?.[0] !== '/prometheus'
                  )
                  .map((value: any) => {
                    return {
                      id: value.Id,
                      name: value.Names?.[0],
                      image: value.Image,
                      state: value.State,
                    };
                  }))
            )
          )
        ),
        catchError((err: any) => {
          this.snackbar.open('Falha ao pausar container', 'Error', {
            duration: 3000,
          });
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
}
