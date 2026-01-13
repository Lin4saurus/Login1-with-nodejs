// src/components/register/register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  formData = { username: '', email: '', password: '' };
  confirmPassword = '';
  acceptTerms = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  get isPasswordMatch(): boolean {
    return this.formData.password === this.confirmPassword;
  }

  onRegister() {
    // Validación de contraseñas coincidentes
    if (!this.isPasswordMatch) {
      this.notificationService.warning('Las contraseñas no coinciden');
      return;
    }

    // Validación de términos y condiciones
    if (!this.acceptTerms) {
      this.notificationService.warning('Debes aceptar los términos y condiciones');
      return;
    }

    this.isLoading = true;

    this.http.post('http://localhost:3000/register', this.formData, {
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
          this.notificationService.success('¡Registro exitoso! Redirigiendo al login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.notificationService.error(response.message || 'Error al registrar');
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
        const errorMessage = error.error?.message || error.message || 'Error al registrar';
        
        // Mensajes específicos según el tipo de error del servidor
        if (errorMessage.includes('Username already exists')) {
          this.notificationService.error('El nombre de usuario ya existe');
        } 
        else if (errorMessage.includes('Email already exists')) {
          this.notificationService.error('El email ya está registrado');
        }
        else if (errorMessage.includes('Username must be between')) {
          this.notificationService.warning('El nombre de usuario debe tener entre 3 y 20 caracteres');
        }
        else if (errorMessage.includes('Username can only contain')) {
          this.notificationService.warning('El usuario solo puede contener letras, números y guiones bajos');
        }
        else if (errorMessage.includes('Password must be at least')) {
          this.notificationService.warning('La contraseña debe tener al menos 6 caracteres');
        }
        else if (errorMessage.includes('Password must contain')) {
          this.notificationService.warning('La contraseña debe contener mayúsculas, minúsculas y números');
        }
        else if (errorMessage.includes('Password must be maximum')) {
          this.notificationService.warning('La contraseña debe tener máximo 20 caracteres');
        }
        else if (errorMessage.includes('Invalid email format')) {
          this.notificationService.error('Formato de email inválido');
        }
        else if (errorMessage.includes('Email must be between')) {
          this.notificationService.warning('El email debe tener entre 3 y 50 caracteres');
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

  // Métodos para login social (simulados)
  registerWithGoogle() {
    this.notificationService.info('Login con Google aún no implementado');
  }

  registerWithFacebook() {
    this.notificationService.info('Login con Facebook aún no implementado');
  }

  registerWithApple() {
    this.notificationService.info('Login con Apple aún no implementado');
  }
}