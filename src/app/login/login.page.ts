import { Component, inject } from '@angular/core';
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
  IonBackButton, 
  IonButtons, 
  IonToast, 
  IonButton,
  IonIcon,
  IonCheckbox,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  lockClosedOutline, 
  logInOutline, 
  alertCircleOutline,
  shieldCheckmarkOutline,
  carOutline,
  buildOutline
} from 'ionicons/icons';
import { Auth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonBackButton, 
    IonButtons, 
    IonInput, 
    IonLabel, 
    IonItem, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonIcon,
    IonCheckbox,
    IonText,
    CommonModule, 
    FormsModule, 
    IonToast, 
    RouterModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      logInOutline,
      alertCircleOutline,
      shieldCheckmarkOutline,
      carOutline,
      buildOutline
    });
  }

  async login() {
    try {
      const persistence = this.rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(this.auth, persistence);
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const userId = userCredential.user.uid;
      const userDocRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData['role'] === 'admin') {
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/home');
        }
      } else {
        this.toastMessage = 'No se encontró información del usuario.';
        this.showToast = true;
      }
    } catch (error) {
      this.toastMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      this.showToast = true;
    }
  }
}
