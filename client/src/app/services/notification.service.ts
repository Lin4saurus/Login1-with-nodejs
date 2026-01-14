// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  private showNotification(message: string, panelClass: string[], duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: panelClass  // Ahora es un array de clases
    };

    this.snackBar.open(message, 'Cerrar', config);
  }

  success(message: string, duration?: number) {
    this.showNotification(message, ['snackbar-success', 'custom-snackbar'], duration);
  }

  error(message: string, duration?: number) {
    this.showNotification(message, ['snackbar-error', 'custom-snackbar'], duration);
  }

  warning(message: string, duration?: number) {
    this.showNotification(message, ['snackbar-warning', 'custom-snackbar'], duration);
  }

  info(message: string, duration?: number) {
    this.showNotification(message, ['snackbar-info', 'custom-snackbar'], duration);
  }
}