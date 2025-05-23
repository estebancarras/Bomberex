import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonList, IonItem, IonLabel, IonAvatar, IonIcon } from '@ionic/angular/standalone';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehiculos',
  templateUrl: 'vehiculos.page.html',
  styleUrls: ['vehiculos.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonList, IonItem, IonLabel, IonAvatar, IonIcon],
})
export class VehiculosPage {
  private firestore = inject(Firestore);
  vehiculos$: Observable<any[]> = collectionData(collection(this.firestore, 'vehiculos'), { idField: 'id' });
}
