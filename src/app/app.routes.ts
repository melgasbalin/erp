// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './dashboard/home/home';
import { AuthGuard } from './core/guards/auth.guard';
import { RegistroComponent } from './pages/registro/registro';
import { SearchComponent } from './pages/search/search';
import { UploadComponent } from './pages/upload/upload';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'registro',
        component: RegistroComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'upload',
        component: UploadComponent,
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
