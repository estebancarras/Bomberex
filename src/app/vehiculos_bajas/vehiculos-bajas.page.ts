import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehiculos-bajas',
  templateUrl: 'vehiculos-bajas.page.html',
  styleUrls: ['vehiculos-bajas.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
})
export class VehiculosBajasPage implements OnInit {
  bajas$: Observable<any[]> = new Observable();

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const ref = collection(this.firestore, 'vehiculos_bajas');
    this.bajas$ = collectionData(ref, { idField: 'id' });
  }
}