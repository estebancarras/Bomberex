import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehiculosService, Vehiculo } from '../services/vehiculos.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehiculoModalComponent } from './vehiculo-modal.component';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { addIcons } from 'ionicons';
import {
  trash,
  arrowUp,
  arrowDown,
  carOutline,
  checkmarkCircleOutline,
  constructOutline,
  alertCircleOutline,
  addCircleOutline,
  filterOutline,
  refreshOutline,
  informationCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
  trashOutline,
  playBackOutline,
  playForwardOutline
} from 'ionicons/icons';

addIcons({
  trash,
  'arrow-up': arrowUp,
  'arrow-down': arrowDown,
  'car-outline': carOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'construct-outline': constructOutline,
  'alert-circle-outline': alertCircleOutline,
  'add-circle-outline': addCircleOutline,
  'filter-outline': filterOutline,
  'refresh-outline': refreshOutline,
  'information-circle-outline': informationCircleOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'play-back-outline': playBackOutline,
  'play-forward-outline': playForwardOutline
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
  isLoading = true;

  searchTerm: string = '';
  filters = {
    vehiculo: '',
    estado: '',
    kilometraje: '',
    marca: '',
    modelo: '',
    patente: ''
  };

  currentPage: number = 1;
  pageSize: number = 3;
  totalPages: number = 1;
  tempPageInput: number = 1;

  sortField: keyof Vehiculo = 'vehiculo';
  sortDirection: 'asc' | 'desc' = 'asc';

  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private vehiculosService = inject(VehiculosService);

  userRole: string | null = null;

  constructor() { }

  async ngOnInit() {
    this.isLoading = true;

    // Cargar preferencia de tamaño de página desde localStorage
    const savedPageSize = localStorage.getItem('vehiculos-page-size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize);
    }

    this.tempPageInput = this.currentPage;

    // Leer parámetros de consulta para filtros
    this.route.queryParams.subscribe(params => {
      if (params['estado']) {
        this.filters.estado = params['estado'];
      }
    });

    await this.vehiculosService.init();
    this.loadVehiculos();

    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });
  }

  loadVehiculos() {
    this.vehiculos$ = this.vehiculosService.getVehiculos();
    this.vehiculos$.subscribe(data => {
      this.dataSource = data;
      this.isLoading = false;
      this.applyFilters();
      console.log('Vehículos cargados:', data);
    });
  }

  getEstadisticas() {
    const total = this.dataSource.length;
    const operativos = this.dataSource.filter(v => v.estado === 'Operativo').length;
    const enMantenimiento = this.dataSource.filter(v => v.estado === 'En mantenimiento').length;
    const fueraServicio = this.dataSource.filter(v => v.estado === 'Fuera de servicio').length;

    return {
      total,
      operativos,
      enMantenimiento,
      fueraServicio
    };
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Operativo':
        return 'success';
      case 'En mantenimiento':
        return 'warning';
      case 'Fuera de servicio':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.estado) count++;
    if (this.filters.kilometraje) count++;
    if (this.filters.marca) count++;
    if (this.filters.modelo) count++;
    if (this.filters.patente) count++;
    if (this.searchTerm) count++;
    return count;
  }

  mostrarFiltrosAvanzados() {
    // Implementar si es necesario
    console.log('Mostrar filtros avanzados');
  }

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
    if (this.userRole !== 'admin') {
      this.toastMessage = 'No tienes permiso para agregar vehículos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
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

  async editarVehiculo(vehiculo: Vehiculo) {
    if (this.userRole !== 'admin' && this.userRole !== 'jefeFlota' && this.userRole !== 'mecanico') {
      this.toastMessage = 'No tienes permiso para editar vehículos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
    const modal = await this.modalCtrl.create({
      component: VehiculoModalComponent,
      componentProps: {
        vehiculo: vehiculo,
        isEdit: true,
        userRole: this.userRole
      }
    });
    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      try {
        await this.vehiculosService.updateVehiculo(vehiculo.id!, data);
        this.toastMessage = 'Vehículo actualizado correctamente';
        this.toastColor = 'success';
        this.showToast = true;
        this.loadVehiculos();
      } catch (error) {
        this.toastMessage = 'Error al actualizar vehículo';
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }
  }

  async deleteVehiculo(id: string) {
    if (this.userRole !== 'admin') {
      this.toastMessage = 'No tienes permiso para eliminar vehículos.';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }
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

  // Métodos de paginación mejorada
  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
    // Guardar en localStorage para persistencia
    localStorage.setItem('vehiculos-page-size', this.pageSize.toString());
  }

  getRangeStart(): number {
    return this.filteredData.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  getRangeEnd(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.filteredData.length ? this.filteredData.length : end;
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  onPageInputChange(event: any) {
    const value = parseInt(event.detail.value);
    if (!isNaN(value)) {
      this.tempPageInput = value;
    }
  }

  validatePageInput() {
    if (this.tempPageInput >= 1 && this.tempPageInput <= this.totalPages) {
      this.currentPage = this.tempPageInput;
      this.updatePagination();
    } else {
      // Resetear al valor actual si es inválido
      this.tempPageInput = this.currentPage;
    }
  }
}