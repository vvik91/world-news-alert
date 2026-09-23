import { Injectable, signal, computed } from '@angular/core';
import { UserRole, UserSession } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Central signal for current authenticated user profile
  private readonly _currentUser = signal<UserSession>({
    id: 'usr-001',
    name: 'John Doe',
    role: 'USER' // Default role
  });

  // Read-only user session signal
  readonly currentUser = this._currentUser.asReadonly();

  // Computed signals for reactive authorization checks
  readonly isAdmin = computed<boolean>(() => this._currentUser().role === 'ADMIN');
  readonly userRole = computed<UserRole>(() => this._currentUser().role);

  /** Switch active role dynamically (useful for dev/testing navigation) */
  setRole(role: UserRole): void {
    this._currentUser.update(user => ({
      ...user,
      role
    }));
  }

  /** Quick toggle helper between USER and ADMIN */
  toggleRole(): void {
    const nextRole: UserRole = this._currentUser().role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.setRole(nextRole);
  }
}