import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-auth-choice',
  templateUrl: './auth-choice.page.html',
  styleUrls: ['./auth-choice.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class AuthChoicePage {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToRegister() {
    this.router.navigateByUrl('/registro');
  }
}
