import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  private authService = inject(AuthService);

  constructor() {
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
