import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  loginForm = { email: '', password: '' };
  error: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() { }
  onSubmit(): void {
    console.log('Intento de login:', this.loginForm);

    // Call the actual login method with email and password
    this.auth.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (response) => {
        if (response) {
          // Get user data after successful login
          this.auth.currentUser$.pipe(
            take(1)
          ).subscribe(user => {
            if (user) {
              this.error = '';
              console.log('Usuario logueado con éxito:', user.name, user.role);
              this.router.navigate(['/dashboard']);
            } else {
              this.error = 'Error al obtener la información del usuario.';
            }
          });
        } else {
          this.error = 'Credenciales incorrectas o usuario no encontrado.';
        }
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Ocurrió un error inesperado.';
      }
    });
  }
}

