import { Component } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";

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

  constructor(private auth: Auth, private toastController: ToastController) {}

  async enviarCorreoRecuperacion() {
    try {
      await sendPasswordResetEmail(this.auth, this.email);
      const toast = await this.toastController.create({
        message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.',
        duration: 3000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al enviar el correo de recuperación.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
