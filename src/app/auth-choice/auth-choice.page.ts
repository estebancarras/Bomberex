import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  shieldOutline, 
  logInOutline, 
  personAddOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-auth-choice',
  templateUrl: './auth-choice.page.html',
  styleUrls: ['./auth-choice.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class AuthChoicePage {
  constructor(private router: Router) {
    addIcons({
      shieldOutline,
      logInOutline,
      personAddOutline,
      shieldCheckmarkOutline
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  goToRegister() {
    this.router.navigateByUrl('/registro');
  }
}
