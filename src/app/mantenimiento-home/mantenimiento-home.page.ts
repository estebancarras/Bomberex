import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mantenimiento-home',
  templateUrl: './mantenimiento-home.page.html',
  styleUrls: ['./mantenimiento-home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class MantenimientoHomePage {
  constructor(private router: Router) {}

  goToAdd() {
    this.router.navigateByUrl('/mantenimiento/add');
  }

  goToList() {
    this.router.navigateByUrl('/mantenimiento/list');
  }
}
