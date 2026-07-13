import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/mock-data/mock-data';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  submitted = false;
  successMessage = false;

  user: User | null = null;
  isSidebarOpen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]{10}$')]],
      fechaNacimiento: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isSidebarOpen = window.innerWidth >= 768;
    }
    this.auth.currentUser$.subscribe((u) => {
      if (this.user !== u) {
        this.user = u;
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  // Método para obtener los controles del formulario
  get f() { return this.registroForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registroForm.invalid) {
      return;
    }

    console.log('Datos de registro:', this.registroForm.value);
    this.successMessage = true;

    setTimeout(() => {
      this.successMessage = false;
      this.onReset();
    }, 3000);
  }

  // Método para resetear el formulario
  onReset() {
    this.submitted = false;
    this.registroForm.reset();
  }
}
