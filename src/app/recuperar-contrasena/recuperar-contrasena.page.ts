import { Component } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage {
  email: string = '';
  isLoading: boolean = false;

  constructor(private auth: Auth, private toastController: ToastController) {}

  async enviarCorreoRecuperacion() {
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Por favor ingresa un correo electrónico.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      const toast = await this.toastController.create({
        message: 'El formato del correo electrónico es inválido.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    this.isLoading = true;
    try {
      await sendPasswordResetEmail(this.auth, this.email);
      const toast = await this.toastController.create({
        message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
        duration: 3000,
        color: 'success',
      });
      await toast.present();
    } catch (error: any) {
      let message = 'Error al enviar el correo de recuperación.';
      if (error.code === 'auth/user-not-found') {
        message = 'No existe una cuenta con ese correo electrónico.';
      }
      const toast = await this.toastController.create({
        message,
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
