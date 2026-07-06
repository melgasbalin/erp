// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { getCurrentUserMock, User } from '../mock-data/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    // Observador para que otros componentes (como el Router) sepan si hay sesión
    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    login(email: string): Observable<boolean> {
        console.log('Simulando login para:', email);

        // SIMULACIÓN: Esperamos un poco como si hiciera una llamada a backend
        return of(null).pipe(
            delay(500),
            map(() => {
                const user = getCurrentUserMock();
                // Verificamos si coincide el email simulado
                if (user && user.email === email) {
                    this.currentUserSubject.next(user);
                    return true;
                }
                return false;
            })
        );
    }

    logout(): void {
        this.currentUserSubject.next(null);
        console.log('Usuario desconectado');
    }
}
