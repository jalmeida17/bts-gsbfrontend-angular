import { Routes } from '@angular/router';
import { Login } from './auth/login';

export default [
    { path: '**', redirectTo: '/notfound' }
] as Routes;
