import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AboutComponent } from './about.component';
import { AboutRoutes } from './about.routing';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [AboutComponent],
  imports: [AboutRoutes, MatButtonModule, MatCardModule],
})
export class AboutModule {}
