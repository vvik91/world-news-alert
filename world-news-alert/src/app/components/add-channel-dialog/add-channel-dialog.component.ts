import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AlertStateService } from '../../services/alert-state.service';
import { ChannelHandler } from '../../handlers/channel-handler.interface';
import { Alert } from '../../models/alert.model';

@Component({
  selector: 'app-add-channel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-channel-dialog.component.html',
  styleUrl: './add-channel-dialog.component.css'
})
export class AddChannelDialogComponent {
  private readonly stateService = inject(AlertStateService);
  private readonly dialogRef = inject(MatDialogRef<AddChannelDialogComponent>);

  channelId = '';
  channelName = '';
  icon = 'notifications';

  isValid(): boolean {
    return this.channelId.trim().length > 0 && this.channelName.trim().length > 0;
  }

  addChannel(): void {
    const id = this.channelId.toLowerCase().trim().replace(/\s+/g, '_');
    const name = this.channelName.trim();
    const iconName = this.icon.trim() || 'notifications';

    // Dynamic Channel Handler Implementation
    const dynamicHandler: ChannelHandler = {
      channelInfo: {
        id,
        name,
        icon: iconName,
        enabled: true
      },
      async sendAlert(alert: Alert): Promise<boolean> {
        console.log(`[Dynamic Channel: ${name}] Dispatched alert "${alert.title}" successfully.`);
        return true;
      }
    };

    this.stateService.registerChannel(dynamicHandler);
    this.dialogRef.close(true);
  }
}