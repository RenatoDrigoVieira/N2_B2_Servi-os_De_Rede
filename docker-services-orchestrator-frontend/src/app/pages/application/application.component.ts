import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { distinctUntilChanged, Subscription, tap } from 'rxjs';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent {
  subscription?: Subscription;

  @ViewChild('drawer')
  drawer?: MatDrawer;

  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.menuService.menuOpened
      .pipe(
        tap((value) => console.log(value)),
        distinctUntilChanged(),
        tap(() => this.drawer?.toggle())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSideNavScroll(event: any) {
    console.log(event);
    event.stopPropagation();
  }

  navigate(url: string) {
    console.log('aaaa');
    this.router.navigate(['application', url]);
  }
}
