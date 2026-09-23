import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AlertStateService } from '../../services/alert-state.service';
import { EventType } from '../../models/alert.model';

@Component({
  selector: 'app-create-alert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-alert-dialog.component.html',
  styleUrl: './create-alert-dialog.component.css'
})
export class CreateAlertDialogComponent {
  readonly stateService = inject(AlertStateService);
  private readonly dialogRef = inject(MatDialogRef<CreateAlertDialogComponent>);

  title = '';
  description = '';
  selectedEventType: EventType = 'breaking_news';
  selectedChannels: string[] = ['email', 'slack'];

  toggleChannel(channelId: string, checked: boolean): void {
    if (checked) {
      this.selectedChannels = [...this.selectedChannels, channelId];
    } else {
      this.selectedChannels = this.selectedChannels.filter(id => id !== channelId);
    }
  }

  addCustomType(label: string): void {
    if (!label.trim()) return;
    const newType = this.stateService.addEventType(label.trim());
    this.selectedEventType = newType.id;
  }

  isValid(): boolean {
    return this.title.trim().length > 0 && this.selectedChannels.length > 0;
  }

  async submitAlert(): Promise<void> {
    if (!this.isValid()) return;

    await this.stateService.createAlert({
      title: this.title.trim(),
      description: this.description.trim(),
      eventType: this.selectedEventType,
      status: 'active',
      channels: this.selectedChannels
    });

    this.dialogRef.close(true);
  }
}