import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'docker-services-orchestrator-frontend';
  showMenuToggle = false;

  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if ((event as any).url.includes('application')) {
          this.showMenuToggle = true;
        } else {
          this.showMenuToggle = false;
        }
      });
  }
  toggleMenu() {
    this.menuService.toggleMenu();
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
