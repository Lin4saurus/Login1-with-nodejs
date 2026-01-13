import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  errorMessage = '';
  isLoading = false;
  showErrorModal = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get isPasswordMatch(): boolean {
    return this.formData.password === this.confirmPassword;
  }

  showErrorPopup(message: string) {
    this.errorMessage = message;
    this.showErrorModal = true;
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.closeErrorModal();
    }, 5000);
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  onRegister() {
    if (!this.isPasswordMatch) {
      this.showErrorPopup('Las contraseñas no coinciden');
      return;
    }

    if (!this.acceptTerms) {
      this.showErrorPopup('Debes aceptar los términos y condiciones');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Enviando datos:', this.formData);

    try {
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
          console.log('Respuesta del servidor:', response);
          this.isLoading = false;
          if (response.success) {
            alert('Registro exitoso! Por favor inicia sesión.');
            this.router.navigate(['/login']);
          } else {
            this.showErrorPopup(response.message || 'Error al registrar');
          }
        },
        error: (error) => {
          console.error('Error completo:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          
          // SIEMPRE resetear isLoading, sin importar el tipo de error
          this.isLoading = false;
          
          let errorMsg = '';
          if (error.name === 'TimeoutError' || error.error?.name === 'TimeoutError') {
            errorMsg = 'La petición tardó demasiado. Por favor intenta nuevamente.';
          } else if (error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          } else if (error.status === 0 || !error.status) {
            errorMsg = 'No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en http://localhost:3000';
          } else {
            errorMsg = 'Error al registrar. Por favor intenta nuevamente.';
          }
          this.showErrorPopup(errorMsg);
        },
        complete: () => {
          // Garantía adicional: siempre resetear isLoading cuando se complete (exitoso o con error)
          this.isLoading = false;
        }
      });
    } catch (error) {
      // Manejo de errores síncronos (no debería pasar, pero por si acaso)
      console.error('Error síncrono:', error);
      this.isLoading = false;
      this.showErrorPopup('Error inesperado. Por favor intenta nuevamente.');
    }
  }

  // Métodos para login social (simulados)
  registerWithGoogle() {
    alert('Login con Google aún no implementado');
  }

  registerWithFacebook() {
    alert('Login con Facebook aún no implementado');
  }

  registerWithApple() {
    alert('Login con Apple aún no implementado');
  }
}