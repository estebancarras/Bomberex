import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, docData, doc } from '@angular/fire/firestore';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: 'detalle-vehiculo.page.html',
  styleUrls: ['detalle-vehiculo.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
})
export class DetalleVehiculoPage implements OnInit {
  vehiculo$!: Observable<any>;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const vehiculoRef = doc(this.firestore, `vehiculos/${id}`);
    this.vehiculo$ = docData(vehiculoRef, { idField: 'id' });
  }
}