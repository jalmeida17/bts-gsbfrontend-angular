import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Profile } from './profile/profile';
import { Login } from './auth/login';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Profile },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
