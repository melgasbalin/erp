// src/app/app.routes.ts (Revisión rápida)
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './dashboard/home/home';
import { AuthGuard } from './core/guards/auth.guard'; // Asegúrate que exista

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
