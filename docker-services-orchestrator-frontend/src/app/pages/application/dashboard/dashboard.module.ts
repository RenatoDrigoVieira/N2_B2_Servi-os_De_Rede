import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
  declarations: [DashboardComponent],
  imports: [DashboardRoutes],
})
export class DashboardModule {}
