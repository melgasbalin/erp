import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/mock-data/mock-data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  /** Estado de visibilidad del sidebar (controlado por el padre) */
  @Input() isOpen: boolean = false;

  /** Usuario autenticado activo */
  @Input() user: User | null = null;

  /** Emite cuando el usuario hace clic en el botón de toggle o en el overlay */
  @Output() toggled = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) {}

  onToggle(): void {
    this.toggled.emit();
  }

  logout(): void {
    this.auth.logout();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }
}
