import { Component, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { distinctUntilChanged, Subscription, tap } from 'rxjs';
import { Dialog } from 'src/app/dialog/dialog.component';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent {
  imageForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  dataSource = [{ id: '1', name: 'teste' }];

  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  createImage() {}

  deleteImage(imageId: string) {
    const dialogRef = this.dialog.open(Dialog, {
      height: '170px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  removeAllImages() {}
}
