import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoginCredentials, LoginResponse } from '../interfaces/login';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterModule]
})
export class LoginPage {
  credentials: LoginCredentials = {
    email: '',
    contrasena: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async onLogin() {
    if (!this.credentials.email || !this.credentials.contrasena) {
      this.showToast('Por favor complete todos los campos', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();

    try {
      this.apiService.login(this.credentials).subscribe({
        next: async (response: LoginResponse) => {
          await loading.dismiss();
          
          if (response && response.status === 'success') {
            localStorage.setItem('userData', JSON.stringify(response.data[0]));
            await this.showToast('Login exitoso', 'success');
            await this.router.navigate(['/tabs/tab1']);
          } else {
            await this.showToast('Credenciales inválidas', 'danger');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          console.error('Login error:', error);
          await this.showToast(
            'Error al iniciar sesión: ' + error,
            'danger'
          );
        }
      });
    } catch (error) {
      await loading.dismiss();
      console.error('Unexpected error:', error);
      await this.showToast('Error inesperado', 'danger');
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
