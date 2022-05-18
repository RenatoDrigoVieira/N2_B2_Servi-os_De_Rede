import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';

@NgModule({
  declarations: [HomeComponent],
  imports: [HomeRoutes, MatButtonModule],
})
export class HomeModule {}
