// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getCurrentUserMock, MOCK_USERS, User } from '../mock-data/mock-data';

export interface LoginResponse {
    token: string;
    user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    /** Observador para que otros componentes (como el Router) sepan si hay sesión */
    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private router: Router) {
        // Verificar si el usuario ya tiene sesión activa (localStorage)
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        if (typeof window === 'undefined') return; // SSR: localStorage no disponible
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            try {
                const user: User = JSON.parse(userData);
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);
            } catch (e) {
                console.error('Error al leer datos de sesión', e);
                localStorage.removeItem('currentUser');
            }
        }
    }

    login(email: string, password: string): Observable<LoginResponse | boolean> {
        console.log('Simulando login para:', email);

        return of(null).pipe(
            delay(500),
            map(() => {
                const user = MOCK_USERS.find(u => u.email === email && u.password === password);
                if (user) {
                    // Guardamos la sesión en localStorage (sin la contraseña)
                    const { password: _pwd, ...safeUser } = user;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('currentUser', JSON.stringify(safeUser));
                    }

                    this.currentUserSubject.next(safeUser as User);
                    this.isAuthenticatedSubject.next(true);

                    return {
                        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
                        user: safeUser as User
                    } as LoginResponse;
                }
                return false;
            })
        );
    }

    register(userData: any): Observable<any> {
        console.log('Simulando registro para:', userData.email);

        return of({ success: true, user: userData }).pipe(
            delay(500),
            map(() => {
                const mockUser: User = {
                    name: userData.nombre || userData.name,
                    email: userData.email,
                    role: 'USER'
                };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('currentUser', JSON.stringify(mockUser));
                }
                this.currentUserSubject.next(mockUser);
                this.isAuthenticatedSubject.next(true);
                return { success: true, user: mockUser };
            })
        );
    }

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        console.log('Usuario desconectado');
        this.router.navigate(['/login']);
    }

    /** Verificar si el usuario está autenticado (para guards u otros componentes) */
    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    /** Obtener datos del usuario actual */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
