import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service'; // Ajusta la ruta si es necesaria
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
export class LoginComponent implements OnInit { // Implementar OnInit es buena práctica para inyectar dependencias
  loginForm = { email: '', password: '' };
  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() { } // Espacio reservado por la interfaz implícita o explícita

  onSubmit(data: any): void {
    console.log('Intento de login:', data);
    
    this.auth.login(data.email).subscribe({ // Llamamos al servicio correctamente
      next: (success: boolean) => {
        if (success) {
          // Una vez que el login simulado termina, tomamos el usuario actual del observable
          this.auth.currentUser$.pipe(
            take(1) // Importante: Suscribirse una sola vez al valor actual
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
