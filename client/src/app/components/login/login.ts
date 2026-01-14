// src/components/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  rememberMe = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onLogin() {
    // Validación básica antes de enviar
    if (!this.credentials.username || !this.credentials.password) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    this.isLoading = true;

    this.http.post('http://localhost:3000/login', this.credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .pipe(
      timeout(30000) // Timeout de 30 segundos
    )
    .subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          // Guarda el usuario en localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          
          this.notificationService.success('¡Inicio de sesión exitoso! Bienvenido');
          
          // Redirige según el rol
          setTimeout(() => {
            if (response.user.is_staff) {
              this.router.navigate(['/admin-dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 1000);
        } else {
          this.notificationService.error(response.message || 'Error de login');
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // Manejo de timeout
        if (error.name === 'TimeoutError' || error.error?.name === 'TimeoutError') {
          this.notificationService.error('La petición tardó demasiado. Por favor intenta nuevamente.');
          return;
        }

        // Manejo de errores de conexión
        if (error.status === 0 || !error.status) {
          this.notificationService.error('No se pudo conectar con el servidor. Verifica que esté corriendo.');
          return;
        }

        // Extraer mensaje de error del servidor
        const errorMessage = error.error?.message || error.message || 'Error de login';
        
        // Mensajes específicos según el tipo de error del servidor
        if (errorMessage.includes('User no encontrado') || errorMessage.includes('not found')) {
          this.notificationService.error('Usuario no encontrado. Verifica tus credenciales');
        }
        else if (errorMessage.includes('pass invalida') || errorMessage.includes('Invalid password') || errorMessage.includes('incorrect')) {
          this.notificationService.error('Contraseña incorrecta. Intenta nuevamente');
        }
        else if (errorMessage.includes('Username o email es requerido')) {
          this.notificationService.warning('Debes ingresar un usuario o email');
        }
        else if (errorMessage.includes('Password') && errorMessage.includes('required')) {
          this.notificationService.warning('La contraseña es requerida');
        }
        else if (errorMessage.includes('Password must contain')) {
          this.notificationService.warning('La contraseña debe contener mayúsculas, minúsculas y números');
        }
        else if (errorMessage.includes('inactive') || errorMessage.includes('disabled')) {
          this.notificationService.error('Tu cuenta está desactivada. Contacta al administrador');
        }
        else {
          this.notificationService.error(errorMessage);
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Métodos para login social
  loginWithGoogle() {
    this.notificationService.info('Login con Google aún no implementado');
  }

  loginWithFacebook() {
    this.notificationService.info('Login con Facebook aún no implementado');
  }

  loginWithApple() {
    this.notificationService.info('Login con Apple aún no implementado');
  }
}