import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Auth } from '@angular/fire/auth';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  isMenuEnabled: boolean = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private menuController = inject(MenuController);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      if (url.includes('login') || url.includes('registro') || url.includes('auth-choice') || url.includes('recuperar-contrasena')) {
        this.isMenuEnabled = false;
        this.menuController.enable(false);
      } else {
        this.isMenuEnabled = true;
        this.menuController.enable(true);
      }
    });
  }

  async logout() {
    await this.menuController.close();
    // Add a short delay to ensure menu is fully closed before proceeding
    await new Promise(resolve => setTimeout(resolve, 300));
    await this.auth.signOut();
    this.isMenuEnabled = false;
    this.menuController.enable(false);
    this.cdr.detectChanges();
    await this.router.navigateByUrl('/auth-choice', { replaceUrl: true });
  }
}
