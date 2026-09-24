import { Injectable, signal, computed, inject } from '@angular/core';
import { UserRole, UserSession } from '../models/user.model';
import { AlertStateService } from './alert-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly stateService = inject(AlertStateService);

  // Central signal for current authenticated user profile
  private readonly _currentUser = signal<UserSession>({
    id: 'usr-001',
    name: 'John Doe',
    role: 'ADMIN' // Default role for development
  });

  // Read-only user session signal
  readonly currentUser = this._currentUser.asReadonly();

  // Computed signals derived from source of truth
  readonly userRole = computed<UserRole>(() => this._currentUser().role);
  readonly isAdmin = computed<boolean>(() => this._currentUser().role === 'ADMIN');

  /** Switch active role dynamically and sync user session */
  setRole(role: UserRole): void {
    this._currentUser.update(user => ({ ...user, role }));
  }

  /** Quick toggle helper between USER and ADMIN, returning the new role */
  toggleRole(): UserRole {
    const nextRole: UserRole = this.userRole() === 'ADMIN' ? 'USER' : 'ADMIN';
    this.setRole(nextRole);
    return nextRole;
  }

  readonly eventTypes = computed(() => this.stateService.eventTypes());

  getEventTypeLabel(typeId: string): string {
    const found = this.eventTypes().find(t => t.id === typeId);
    return found ? found.label : typeId;
  }
}