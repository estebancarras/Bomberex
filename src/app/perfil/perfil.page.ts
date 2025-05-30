import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PerfilPage implements OnInit {
  user: User | null = null;
  name: string = '';
  correo: string = '';

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async ngOnInit() {
    this.user = this.auth.currentUser;
    if (this.user) {
      this.correo = this.user.email ?? '';
      // Obtener datos adicionales (name) de Firestore si existen
      const userDocRef = doc(this.firestore, 'users', this.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.name = data['name'] || '';
      }
    }
  }
}
