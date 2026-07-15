import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/mock-data/mock-data';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  submitted = false;
  error: string | null = null;
  successMessage = false;
  user: User | null = null;
  isSidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^\d{10}$/)]],
      fechaNacimiento: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isSidebarOpen = window.innerWidth >= 768;
    }
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
    });
  }

  /** Getter para acceder fácilmente a los controles del formulario en el HTML (f['campo']) */
  get f() {
    return this.registroForm.controls;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registroForm.valid) {
      const formData = { ...this.registroForm.value };
      delete formData.confirmPassword;

      this.auth.register(formData).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          this.error = null;
          this.successMessage = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Error en el registro:', error);
          this.error = 'Error al registrar usuario. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.error = null;
    this.successMessage = false;
    this.registroForm.reset();
  }
}
