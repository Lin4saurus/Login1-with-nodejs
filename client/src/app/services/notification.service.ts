// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  private showNotification(message: string, panelClass: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    };

    this.snackBar.open(message, 'Cerrar', config);
  }

  success(message: string, duration?: number) {
    this.showNotification(message, 'snackbar-success', duration);
  }

  error(message: string, duration?: number) {
    this.showNotification(message, 'snackbar-error', duration);
  }

  warning(message: string, duration?: number) {
    this.showNotification(message, 'snackbar-warning', duration);
  }

  info(message: string, duration?: number) {
    this.showNotification(message, 'snackbar-info', duration);
  }
}