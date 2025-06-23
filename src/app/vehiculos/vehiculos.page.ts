import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculosService, Vehiculo } from '../services/vehiculos.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehiculoModalComponent } from './vehiculo-modal.component';
import { Observable } from 'rxjs';

import { addIcons } from 'ionicons';
import { trash, arrowUp, arrowDown } from 'ionicons/icons';

addIcons({
  trash,
  'arrow-up': arrowUp,
  'arrow-down': arrowDown
});

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule, VehiculoModalComponent]
})
export class VehiculosPage implements OnInit {
  vehiculos$: Observable<Vehiculo[]> | undefined;
  dataSource: Vehiculo[] = [];
  filteredData: Vehiculo[] = [];
  paginatedData: Vehiculo[] = [];

  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  searchTerm: string = '';
  filters = {
    vehiculo: '',
    estado: '',
    kilometraje: '',
    marca: '',
    modelo: '',
    patente: ''
  };

  resetFilters() {
    this.filters = {
      vehiculo: '',
      estado: '',
      kilometraje: '',
      marca: '',
      modelo: '',
      patente: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  sortField: keyof Vehiculo = 'vehiculo';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private vehiculosService: VehiculosService, private router: Router, private modalCtrl: ModalController) {}

  async ngOnInit() {
    await this.vehiculosService.init();
    this.loadVehiculos();
  }

  loadVehiculos() {
    this.vehiculos$ = this.vehiculosService.getVehiculos();
    this.vehiculos$.subscribe(data => {
      this.dataSource = data;
      this.applyFilters();
      console.log('Vehículos cargados:', data);
    });
  }

  searchChanged(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.dataSource.filter(item => {
      const matchesSearch = this.searchTerm ? (
        (item.vehiculo && item.vehiculo.toLowerCase().includes(this.searchTerm)) ||
        (item.estado && item.estado.toLowerCase().includes(this.searchTerm)) ||
        (item.kilometraje !== undefined && item.kilometraje !== null && item.kilometraje.toString().toLowerCase().includes(this.searchTerm)) ||
        (item.marca && item.marca.toLowerCase().includes(this.searchTerm)) ||
        (item.modelo && item.modelo.toLowerCase().includes(this.searchTerm)) ||
        (item.patente && item.patente.toLowerCase().includes(this.searchTerm))
      ) : true;

      const matchesVehiculo = this.filters.vehiculo ? item.vehiculo?.toLowerCase().includes(this.filters.vehiculo.toLowerCase()) : true;
      const matchesEstado = this.filters.estado ? item.estado === this.filters.estado : true;

      // For kilometraje filter, convert filter to number and compare numerically (greater or equal)
      const filterKilometrajeNum = this.filters.kilometraje ? Number(this.filters.kilometraje) : null;
      const itemKilometrajeNum = item.kilometraje !== undefined && item.kilometraje !== null ? Number(item.kilometraje) : null;
      const matchesKilometraje = filterKilometrajeNum !== null && !isNaN(filterKilometrajeNum) && itemKilometrajeNum !== null && !isNaN(itemKilometrajeNum)
        ? itemKilometrajeNum >= filterKilometrajeNum
        : !this.filters.kilometraje; // if no filter, match all

      const matchesMarca = this.filters.marca ? item.marca?.toLowerCase().includes(this.filters.marca.toLowerCase()) : true;
      const matchesModelo = this.filters.modelo ? item.modelo?.toLowerCase().includes(this.filters.modelo.toLowerCase()) : true;
      const matchesPatente = this.filters.patente ? item.patente?.toLowerCase().includes(this.filters.patente.toLowerCase()) : true;

      return matchesSearch && matchesVehiculo && matchesEstado && matchesKilometraje && matchesMarca && matchesModelo && matchesPatente;
    });

    if (this.sortField) {
      this.filteredData.sort((a, b) => {
        const aField = a[this.sortField];
        const bField = b[this.sortField];

        // Check if field is kilometraje (numeric), sort numerically
        if (this.sortField === 'kilometraje') {
          const aNum = aField !== undefined && aField !== null ? Number(aField) : 0;
          const bNum = bField !== undefined && bField !== null ? Number(bField) : 0;
          return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        } else {
          // Sort lexicographically for other fields
          const aStr = aField ? aField.toString().toLowerCase() : '';
          const bStr = bField ? bField.toString().toLowerCase() : '';
          if (aStr < bStr) return this.sortDirection === 'asc' ? -1 : 1;
          if (aStr > bStr) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.paginatedData = this.filteredData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
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
        this.loadVehiculos();
      } catch (error) {
        this.toastMessage = 'Error al agregar vehículo';
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }
  }

  async deleteVehiculo(id: string) {
    try {
      await this.vehiculosService.deleteVehiculo(id);
      this.toastMessage = 'Vehículo eliminado correctamente';
      this.toastColor = 'success';
      this.showToast = true;
      this.loadVehiculos();
    } catch (error) {
      this.toastMessage = 'Error al eliminar vehículo';
      this.toastColor = 'danger';
      this.showToast = true;
    }
  }

  goToDetalle(id: string) {
    this.router.navigate(['/detalle-vehiculo', id]);
  }

  sortBy(field: keyof Vehiculo) {
    console.log('Sorting by field:', field, 'Current sortField:', this.sortField, 'Current sortDirection:', this.sortDirection);
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    console.log('New sortField:', this.sortField, 'New sortDirection:', this.sortDirection);
    this.applyFilters();
  }
}
