import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        canActivateChild: [publicGuard()],
        path: 'auth',
        loadChildren: () =>import('./auth/features/auth.routes'),
    },
    {
        canActivateChild: [privateGuard()],
        path: 'tasks',
        loadComponent:()=> import('./shared/ui/layout/layout.component'), //cargar el layout solo para las vistas privadas
        loadChildren: () =>import('./task/features/task.routes'),
    },
    {
        path: '**',
        redirectTo: '/tasks',
    }
];
