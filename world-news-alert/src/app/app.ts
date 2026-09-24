import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {
  protected readonly title = signal('world-news-alert');
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  navigateToUser(): void {
    this.authService.setRole('USER');
    this.router.navigate(['/dashboard']);
  }

  navigateToAdmin(): void {
    this.authService.setRole('ADMIN');
    this.router.navigate(['/admin']);
  }

  toggleRoleAndNavigate(): void {
    const newRole = this.authService.toggleRole();
    if (newRole === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}