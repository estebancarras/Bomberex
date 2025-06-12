import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehiculosService, Vehiculo } from '../services/vehiculos.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehiculoModalComponent } from './vehiculo-modal.component';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, VehiculoModalComponent]
})
export class VehiculosPage implements OnInit {
  vehiculos$: Vehiculo[] = [];
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(private vehiculosService: VehiculosService, private router: Router, private modalCtrl: ModalController) {}

  async ngOnInit() {
    await this.vehiculosService.init();
    await this.loadVehiculos();
  }

  async loadVehiculos() {
    this.vehiculos$ = await this.vehiculosService.getVehiculos();
  }

  searchChanged(event: any) {
    // Aquí puedes implementar la lógica de búsqueda
    console.log('Buscar:', event.detail.value);
  }

  async addVehiculo() {
    const modal = await this.modalCtrl.create({
      component: VehiculoModalComponent
    });
    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      try {
        await this.vehiculosService.addVehiculo(data);
        this.toastMessage = 'Vehículo agregado correctamente';
        this.toastColor = 'success';
        this.showToast = true;
        await this.loadVehiculos();
      } catch (error) {
        this.toastMessage = 'Error al agregar vehículo';
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }
  }

  async deleteVehiculo(id: number) {
    try {
      await this.vehiculosService.deleteVehiculo(id);
      this.toastMessage = 'Vehículo eliminado correctamente';
      this.toastColor = 'success';
      this.showToast = true;
      await this.loadVehiculos();
    } catch (error) {
      this.toastMessage = 'Error al eliminar vehículo';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }

  goToDetalle(id: number) {
    this.router.navigate(['/detalle-vehiculo', id]);
  }
}
