import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData, updateDoc, collection, collectionData } from '@angular/fire/firestore';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonDatetime, IonToast, IonButtons, IonBackButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-mantenimiento',
  templateUrl: './editar-mantenimiento.page.html',
  styleUrls: ['./editar-mantenimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonDatetime, IonToast, IonButtons, IonBackButton, IonSelect, IonSelectOption
  ]
})
export class EditarMantenimientoPage implements OnInit {
  mantenimiento: any = null;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  vehiculos$: Observable<any[]> = new Observable();

  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const mantenimientoRef = doc(this.firestore, `mantenimientos/${id}`);
      docData(mantenimientoRef, { idField: 'id' }).subscribe(data => {
        this.mantenimiento = data;
      });
    }
    this.vehiculos$ = collectionData(collection(this.firestore, 'vehiculos'), { idField: 'id' });
  }

  async guardarCambios() {
    if (!this.mantenimiento.tipo || !this.mantenimiento.descripcion || !this.mantenimiento.fecha || !this.mantenimiento.vehiculo || !this.mantenimiento.estado) {
      this.toastMessage = 'Por favor, completa todos los campos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
    try {
      const mantenimientoRef = doc(this.firestore, `mantenimientos/${this.mantenimiento.id}`);
      await updateDoc(mantenimientoRef, {
        tipo: this.mantenimiento.tipo,
        descripcion: this.mantenimiento.descripcion,
        fecha: this.mantenimiento.fecha,
        vehiculo: this.mantenimiento.vehiculo,
        estado: this.mantenimiento.estado
      });
      this.toastMessage = 'Mantenimiento actualizado con éxito.';
      this.toastColor = 'success';
      this.showToast = true;
      setTimeout(() => this.router.navigateByUrl('/mantenimiento-list'), 1000);
    } catch (error) {
      this.toastMessage = 'Error al actualizar mantenimiento.';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }
}
