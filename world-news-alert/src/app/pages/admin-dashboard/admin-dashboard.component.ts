import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { AlertStateService } from '../../services/alert-state.service';
import { DispatchStatus } from '../../models/alert.model';
import { CreateAlertDialogComponent } from '../../components/create-alert-dialog/create-alert-dialog.component';
import { AddChannelDialogComponent } from '../../components/add-channel-dialog/add-channel-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: [provideNativeDateAdapter()]
})
export class AdminDashboardComponent {
  readonly stateService = inject(AlertStateService);
  private readonly dialog = inject(MatDialog);

  // Global Admin Filter State (Defaults: current day, success status)
  readonly selectedDate = signal<Date>(new Date());
  readonly selectedDispatchStatus = signal<DispatchStatus | 'all'>('success');

  // Paginator Signal State
  readonly pageSize = signal<number>(25);
  readonly pageIndex = signal<number>(0);
  readonly pageSizeOptions = [25, 50, 100];

  // Derive component signal directly from stateService
  readonly eventTypes = computed(() => this.stateService.eventTypes());

  /** Global filtered alerts pipeline across Admin View */
  readonly filteredAlerts = computed(() => {
    const alerts = this.stateService.alerts();
    const dateFilter = this.selectedDate();
    const statusFilter = this.selectedDispatchStatus();

    return alerts.filter(alert => {
      // 1. Date Filter (Same calendar day check)
      if (dateFilter) {
        const alertDate = new Date(alert.createdAt);
        const isSameDay =
          alertDate.getFullYear() === dateFilter.getFullYear() &&
          alertDate.getMonth() === dateFilter.getMonth() &&
          alertDate.getDate() === dateFilter.getDate();

        if (!isSameDay) return false;
      }

      // 2. Dispatch Status Filter across logs
      if (statusFilter !== 'all') {
        const hasMatchingLog = alert.dispatchLogs.some(log => log.status === statusFilter);
        if (!hasMatchingLog && alert.dispatchLogs.length > 0) return false;
      }

      return true;
    });
  });

  /** Paginated view subset */
  readonly paginatedAlerts = computed(() => {
    const filtered = this.filteredAlerts();
    const start = this.pageIndex() * this.pageSize();
    return filtered.slice(start, start + this.pageSize());
  });

  // Action Handlers
  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  toggleAlertStatus(alertId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.stateService.toggleAlertStatus(alertId);
  }

  deleteAlert(alertId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.stateService.deleteAlert(alertId);
  }

  toggleGlobalCreation(enabled: boolean): void {
    this.stateService.setGlobalAlertCreation(enabled);
  }

  toggleChannelStatus(channelId: string, enabled: boolean): void {
    this.stateService.toggleChannelStatus(channelId, enabled);
  }

  openCreateModal(): void {
    this.dialog.open(CreateAlertDialogComponent, { width: '520px' });
  }

  openAddChannelModal(): void {
    this.dialog.open(AddChannelDialogComponent, { width: '440px' });
  }

  getEventTypeLabel(typeId: string): string {
    const found = this.eventTypes().find(t => t.id === typeId);
    return found ? found.label : typeId;
  }
}