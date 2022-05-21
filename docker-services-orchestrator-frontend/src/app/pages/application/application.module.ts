import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutes } from './application.routing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ApplicationComponent],
  imports: [ApplicationRoutes, MatSidenavModule, MatDividerModule],
})
export class ApplicationModule {}
