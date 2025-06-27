import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class PerfilPage implements OnInit {
  user: User | null = null;
  name: string = '';
  correo: string = '';
  photoURL: string = '';
  role: string = '';
  editingName: boolean = false;

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async ngOnInit() {
    this.user = this.auth.currentUser;
    if (this.user) {
      this.correo = this.user.email ?? '';
      this.photoURL = this.user.photoURL ?? '';
      // Obtener datos adicionales (name, role) de Firestore si existen
      const userDocRef = doc(this.firestore, 'users', this.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.name = data['name'] || '';
        this.role = data['role'] || '';
      }
    }

  }

  editPhoto() {
    // Placeholder for photo edit functionality
    alert('Funcionalidad para cambiar foto de perfil próximamente.');
  }

  async saveName() {
    if (!this.user) return;
    const userDocRef = doc(this.firestore, 'users', this.user.uid);
    try {
      await setDoc(userDocRef, { name: this.name }, { merge: true });
      this.editingName = false;
    } catch (error) {
      console.error('Error al guardar el nombre:', error);
    }
  }

  logout() {
    this.auth.signOut();
  }
}
