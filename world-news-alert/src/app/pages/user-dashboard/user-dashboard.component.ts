import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { AlertStateService } from '../../services/alert-state.service';
import { Alert, AlertStatus } from '../../models/alert.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatInputModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  readonly stateService = inject(AlertStateService);

  // Filter Signal States (Defaults per requirements)
  readonly selectedStatus = signal<AlertStatus | 'all'>('active');
  readonly selectedEventType = signal<string>('all');
  readonly selectedDate = signal<Date>(new Date()); // Default: Current Day

  // Pagination Signal States
  readonly pageSize = signal<number>(25);
  readonly pageIndex = signal<number>(0);
  readonly pageSizeOptions = [25, 50, 100];

  // Available event types dynamic signal from state service
  readonly eventTypes = computed(() => this.stateService.eventTypes());

  /** Filtered alerts pipeline computed reactively */
  readonly filteredAlerts = computed(() => {
    const alerts = this.stateService.alerts();
    const statusFilter = this.selectedStatus();
    const eventTypeFilter = this.selectedEventType();
    const dateFilter = this.selectedDate();

    return alerts.filter(alert => {
      // 1. Status Filter
      if (statusFilter !== 'all' && alert.status !== statusFilter) {
        return false;
      }

      // 2. Event Type Filter
      if (eventTypeFilter !== 'all' && alert.eventType !== eventTypeFilter) {
        return false;
      }

      // 3. Date Filter (Same calendar day check)
      if (dateFilter) {
        const alertDate = new Date(alert.createdAt);
        const isSameDay =
          alertDate.getFullYear() === dateFilter.getFullYear() &&
          alertDate.getMonth() === dateFilter.getMonth() &&
          alertDate.getDate() === dateFilter.getDate();

        if (!isSameDay) return false;
      }

      return true;
    });
  });

  /** Paginated subset of filtered alerts */
  readonly paginatedAlerts = computed(() => {
    const filtered = this.filteredAlerts();
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  // Action Handlers
  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  toggleAlertStatus(alertId: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevents expansion panel from toggling when clicking action button
    this.stateService.toggleAlertStatus(alertId);
  }

  deleteAlert(alertId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.stateService.deleteAlert(alertId);
  }

  clearDateFilter(): void {
    this.selectedDate.set(new Date());
    this.pageIndex.set(0);
  }

  getEventTypeLabel(typeId: string): string {
    const found = this.eventTypes().find(t => t.id === typeId);
    return found ? found.label : typeId;
  }
}