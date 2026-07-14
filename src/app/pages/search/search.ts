import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/mock-data/mock-data';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { AddModalComponent } from './add-modal/add-modal';
import { EditModalComponent } from './edit-modal/edit-modal';


interface Registro {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.html',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, AddModalComponent, EditModalComponent],
  styleUrls: ['./search.css']
})
export class SearchComponent implements OnInit {
   user: User | null = null;
   isSidebarOpen: boolean = false;

   registros: Registro[] = [];
   filtros: any = {};
   displayedRegistros: Registro[] = [];

   showAddModal = false;
   showEditModal = false;
   registroSeleccionado: Registro | null = null;

   constructor(
    private router: Router,
    private auth: AuthService)
   {
    

   }
  ngOnInit(): void {
     if (typeof window !== 'undefined') {
      this.isSidebarOpen = window.innerWidth >= 768;
    }
    this.auth.currentUser$.subscribe((u) => {
      if (this.user !== u) {
        this.user = u;
      }
    })
    // Datos de ejemplo - puedes reemplazar con llamadas a tu servicio
    this.registros = [
      { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '555-0101' },
      { id: 2, nombre: 'María López', email: 'maria@example.com', telefono: '555-0102' },
      { id: 3, nombre: 'Carlos García', email: 'carlos@example.com', telefono: '555-0103' },
      { id: 4, nombre: 'Ana Martínez', email: 'ana@example.com', telefono: '555-0104' }
    ];
    
    this.actualizarTabla();
  }

    toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  filtrarRegistros(): void {
    const filtro = this.filtros.search || '';
    if (!filtro) {
      this.displayedRegistros = this.registros;
    } else {
      this.displayedRegistros = this.registros.filter(registro => 
        registro.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        registro.email.toLowerCase().includes(filtro.toLowerCase()) ||
        registro.telefono.includes(filtro)
      );
    }
  }

  actualizarTabla(): void {
    this.filtrarRegistros();
  }

  editarRegistro(id: number): void {
    const reg = this.registros.find(r => r.id === id);
    if (reg) {
      this.registroSeleccionado = { ...reg }; // Copia para no mutar directamente
      this.showEditModal = true;
    }
  }

  guardarNuevoRegistro(data: any): void {
    // Generar un ID simple
    const maxId = this.registros.length > 0 ? Math.max(...this.registros.map(r => r.id)) : 0;
    const nuevoRegistro: Registro = {
      id: maxId + 1,
      ...data
    };
    this.registros = [nuevoRegistro, ...this.registros];
    this.actualizarTabla();
  }

  guardarCambios(data: any): void {
    this.registros = this.registros.map(r => r.id === data.id ? data : r);
    this.actualizarTabla();
  }

  eliminarRegistro(id: number): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el registro con ID ${id}?`)) {
      this.registros = this.registros.filter(registro => registro.id !== id);
      this.actualizarTabla();
    }
  }
}
