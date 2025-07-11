import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
standalone: true,
imports: [IonButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class RegistroPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';

  private auth = inject(Auth);
  private router = inject(Router);

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      // Guardar datos adicionales en Firestore con rol "normal"
      const userDocRef = doc(this.firestore, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        name: this.name,
        email: this.email,
        role: 'normal'
      });
      console.log('Usuario registrado:', userCredential.user);
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  }

  private firestore = inject(Firestore);

  ngOnInit() {}
}
