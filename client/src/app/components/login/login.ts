import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { timeout } from 'rxjs/operators';

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
  errorMessage = '';
  isLoading = false;
  showErrorModal = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.http.post('http://localhost:3000/login', this.credentials)
        .pipe(
          timeout(30000) // Timeout de 30 segundos
        )
        .subscribe({
          next: (response: any) => {
            this.isLoading = false;
            if (response.success) {
              // Guarda el usuario en localStorage
              localStorage.setItem('user', JSON.stringify(response.user));
              
              // Redirige según el rol
              if (response.user.is_staff) {
                this.router.navigate(['/admin-dashboard']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            } else {
              this.showErrorPopup(response.message || 'Error de login');
            }
          },
          error: (error) => {
            console.error('Error en login:', error);
            this.isLoading = false;
            
            let errorMsg = '';
            if (error.name === 'TimeoutError' || error.error?.name === 'TimeoutError') {
              errorMsg = 'La petición tardó demasiado. Por favor intenta nuevamente.';
            } else if (error.error?.message) {
              errorMsg = error.error.message;
            } else if (error.status === 0 || !error.status) {
              errorMsg = 'No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.';
            } else {
              errorMsg = 'Error de login. Por favor intenta nuevamente.';
            }
            this.showErrorPopup(errorMsg);
          },
          complete: () => {
            // Garantía adicional: siempre resetear isLoading
            this.isLoading = false;
          }
        });
    } catch (error) {
      console.error('Error síncrono en login:', error);
      this.isLoading = false;
      this.showErrorPopup('Error inesperado. Por favor intenta nuevamente.');
    }
  }

  // Métodos para login social (simulados)
  loginWithGoogle() {
    alert('Login con Google aún no implementado');
  }

  loginWithFacebook() {
    alert('Login con Facebook aún no implementado');
  }

  loginWithApple() {
    alert('Login con Apple aún no implementado');
  }
}