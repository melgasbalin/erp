// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  // Inyectar el servicio y el router usando la nueva sintaxis de v16+
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        // Si hay usuario, permitimos pasar
        return true;
      } else {
        // Si no hay usuario, redirigimos al login y guardamos en donde intentaba entrar
        router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
    })
  );
};
