import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonBackButton, 
  IonButtons,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonToast,
  IonText,
  AlertController
} from '@ionic/angular/standalone';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { 
  personOutline,
  mailOutline, 
  lockClosedOutline, 
  personAddOutline, 
  alertCircleOutline,
  shieldCheckmarkOutline,
  shieldOutline,
  buildOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonButton, 
    IonInput, 
    IonLabel, 
    IonItem, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonBackButton, 
    IonButtons,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonToast,
    IonText,
    CommonModule, 
    FormsModule, 
    RouterModule
  ]
})
export class RegistroPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'bombero';
  acceptTerms: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';

  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);
  private alertController = inject(AlertController);

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      alertCircleOutline,
      shieldCheckmarkOutline,
      shieldOutline,
      buildOutline
    });
  }

  async register() {
    if (!this.acceptTerms) {
      this.toastMessage = 'Debes aceptar los términos y condiciones';
      this.showToast = true;
      return;
    }

    if (!this.email || !this.password) {
      this.toastMessage = 'El correo y la contraseña son obligatorios';
      this.showToast = true;
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastMessage = 'El formato del correo electrónico es inválido';
      this.showToast = true;
      return;
    }

    if (this.password.length < 6) {
      this.toastMessage = 'La contraseña debe tener al menos 6 caracteres';
      this.showToast = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toastMessage = 'Las contraseñas no coinciden';
      this.showToast = true;
      return;
    }

    try {
      console.log('Intentando registrar usuario:', this.email);
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      // Guardar datos adicionales en Firestore
      const userDocRef = doc(this.firestore, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        name: this.name,
        email: this.email,
        role: this.role
      });
      
      this.toastColor = 'success';
      this.toastMessage = 'Registro exitoso';
      this.showToast = true;
      
      setTimeout(() => {
        this.router.navigateByUrl('/home');
      }, 1000);
    } catch (error: any) {
      this.toastColor = 'danger';
      if (error.code === 'auth/email-already-in-use') {
        this.toastMessage = 'El correo electrónico ya está en uso.';
      } else {
        this.toastMessage = 'Error al registrar: ' + (error.message || error);
      }
      this.showToast = true;
    }
  }

  async showTerms() {
    const alert = await this.alertController.create({
      header: 'Términos y Condiciones',
      message: 'Al registrarte, aceptas los términos de uso y la política de privacidad de Bomberex.',
      buttons: ['Entendido']
    });

    await alert.present();
  }

  ngOnInit() { }
}
