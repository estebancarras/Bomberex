import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  firestore = inject(Firestore);
  vehiculos$: Observable<any[]>;

  constructor() {
    const ref = collection(this.firestore, 'vehiculos');
    this.vehiculos$ = collectionData(ref, { idField: 'Nombre' });
  }
}