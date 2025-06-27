import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData, updateDoc, collection, collectionData } from '@angular/fire/firestore';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonDatetime, IonToast, IonButtons, IonBackButton, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-mantenimiento',
  templateUrl: './editar-mantenimiento.page.html',
  styleUrls: ['./editar-mantenimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonDatetime, IonToast, IonButtons, IonBackButton, IonSelect, IonSelectOption, IonCheckbox
  ]
})
export class EditarMantenimientoPage implements OnInit {
  mantenimientoForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  vehiculos$: Observable<any[]> = new Observable();
  vehiculosLista: any[] = [];

  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.mantenimientoForm = new FormGroup({
      tipo: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      tiempoManteni: new FormControl([], Validators.required),
      categoria: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      patente: new FormControl('', Validators.required),
      prioridad: new FormControl('', Validators.required),
      tallerResponsable: new FormControl('', Validators.required),
      vehiculo: new FormControl('', Validators.required),
      completado: new FormControl(false)
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const mantenimientoRef = doc(this.firestore, `mantenimientos/${id}`);
      docData(mantenimientoRef, { idField: 'id' }).subscribe(data => {
        if (data && typeof data === 'object') {
          this.mantenimientoForm.patchValue({
            tipo: (data as any).tipo,
            descripcion: (data as any).descripcion,
            tiempoManteni: (data as any).tiempoManteni || [],
            categoria: (data as any).categoria,
            estado: (data as any).estado,
            patente: (data as any).patente,
            prioridad: (data as any).prioridad,
            tallerResponsable: (data as any).tallerResponsable,
            vehiculo: (data as any).vehiculo,
            completado: (data as any).completado === 'Completado' ? true : false
          });
        }
      });
    }
    this.vehiculos$ = collectionData(collection(this.firestore, 'vehiculos'), { idField: 'id' });
    this.vehiculos$.subscribe(lista => this.vehiculosLista = lista);
  }

  getVehiculoNombre(id: string): string {
    const v = this.vehiculosLista.find(x => x.id === id);
    return v ? v.vehiculo : '';
  }

  async guardarCambios() {
    if (this.mantenimientoForm.invalid) {
      this.toastMessage = 'Por favor, completa todos los campos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
    try {
      const mantenimientoRef = doc(this.firestore, `mantenimientos/${this.mantenimientoForm.value.id}`);
      await updateDoc(mantenimientoRef, {
        tipo: this.mantenimientoForm.value.tipo,
        descripcion: this.mantenimientoForm.value.descripcion,
        tiempoManteni: this.mantenimientoForm.value.tiempoManteni,
        categoria: this.mantenimientoForm.value.categoria,
        estado: this.mantenimientoForm.value.estado,
        patente: this.mantenimientoForm.value.patente,
        prioridad: this.mantenimientoForm.value.prioridad,
        tallerResponsable: this.mantenimientoForm.value.tallerResponsable,
        vehiculo: this.mantenimientoForm.value.vehiculo,
        completado: this.mantenimientoForm.value.completado ? 'Completado' : 'No completado'
      });

      // Actualizar el estado del vehículo relacionado
      const vehiculoRef = doc(this.firestore, `vehiculos/${this.mantenimientoForm.value.vehiculo}`);
      await updateDoc(vehiculoRef, {
        estado: this.mantenimientoForm.value.estado
      });

      this.toastMessage = 'Mantenimiento y estado del vehículo actualizados con éxito.';
      this.toastColor = 'success';
      this.showToast = true;
      setTimeout(() => this.router.navigateByUrl('/mantenimiento-list'), 1000);
    } catch (error) {
      this.toastMessage = 'Error al actualizar mantenimiento o vehículo.';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }
}
