import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mantenimientos-list',
  templateUrl: './mantenimientos-list.page.html',
  styleUrls: ['./mantenimientos-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonListHeader, IonButtons, IonBackButton]
})
export class MantenimientosListPage {
  private firestore = inject(Firestore);
  mantenimientos$: Observable<any[]> = collectionData(collection(this.firestore, 'mantenimientos'), { idField: 'id' });
}
