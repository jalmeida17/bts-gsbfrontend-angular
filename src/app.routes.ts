import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { Login } from './app/pages/auth/login';
import { Signup } from './app/pages/auth/signup';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboard } from './app/pages/admin-dashboard/admin-dashboard';
import { AdminStats } from './app/pages/admin-stats/admin-stats';

export const appRoutes: Routes = [
    { path: '', component: Login },
    { path: 'signup', component: Signup },
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'admin', component: AdminDashboard, canActivate: [AdminGuard] },
            { path: 'admin-stats', component: AdminStats, canActivate: [AdminGuard] },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
