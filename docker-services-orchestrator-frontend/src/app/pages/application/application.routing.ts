import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('src/app/pages/application/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'images',
        loadChildren: () =>
          import('src/app/pages/application/images/images.module').then(
            (m) => m.ImagesModule
          ),
      },
      {
        path: 'containers',
        loadChildren: () =>
          import('src/app/pages/application/containers/containers.module').then(
            (m) => m.ContainersModule
          ),
      },
    ],
  },
];

export const ApplicationRoutes = RouterModule.forChild(routes);
