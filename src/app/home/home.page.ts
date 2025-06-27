import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonMenuButton } from '@ionic/angular/standalone';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonMenuButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {
  usuario = 'Bombero';
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = (role === 'admin');
    });
  }

}
