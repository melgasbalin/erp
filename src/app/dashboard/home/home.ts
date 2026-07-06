import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/mock-data/mock-data';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  isSidebarOpen: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Iniciar abierto en escritorio, cerrado en móvil
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
}
