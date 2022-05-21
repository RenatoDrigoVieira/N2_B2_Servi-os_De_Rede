import { Routes, RouterModule } from '@angular/router';

import { ContainersComponent } from './containers.component';

const routes: Routes = [
  {
    path: '',
    component: ContainersComponent,
  },
];

export const ContainersRoutes = RouterModule.forChild(routes);
