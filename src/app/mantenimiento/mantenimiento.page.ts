import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, addDoc, doc, docData, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton, IonMenuButton,
  IonSearchbar, IonChip, IonLabel, IonIcon, IonItem, IonInput, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonToast, IonSelect, IonSelectOption, IonSpinner
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  downloadOutline, createOutline, trashOutline, filterOutline, calendarOutline,
  addCircleOutline, chevronBackOutline, chevronForwardOutline, closeOutline,
  clipboardOutline, arrowDownOutline, arrowUpOutline, constructOutline,
  checkmarkCircleOutline, timeOutline, alertCircleOutline, warningOutline,
  refreshOutline, informationCircleOutline, arrowBack
} from 'ionicons/icons';

import { VehiculosService } from '../services/vehiculos.service';
import { MantenimientoModalComponent } from './mantenimiento-modal.component';
import jsPDF from 'jspdf';

addIcons({
  'download-outline': downloadOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'filter-outline': filterOutline,
  'calendar-outline': calendarOutline,
  'add-circle-outline': addCircleOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'close-outline': closeOutline,
  'clipboard-outline': clipboardOutline,
  'arrow-down': arrowDownOutline,
  'arrow-up': arrowUpOutline,
  'construct-outline': constructOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'time-outline': timeOutline,
  'alert-circle-outline': alertCircleOutline,
  'warning-outline': warningOutline,
  'refresh-outline': refreshOutline,
  'information-circle-outline': informationCircleOutline,
  'arrow-back': arrowBack
});

@Component({
  selector: 'app-mantenimiento',
  templateUrl: 'mantenimiento.page.html',
  styleUrls: ['mantenimiento.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonButton,
    IonMenuButton,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonIcon,
    IonItem,
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonToast,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    MantenimientoModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ModalController]
})

export class MantenimientoPage implements OnInit {
  // Inyección de dependencias
  private firestore = inject(Firestore);
  private modalCtrl = inject(ModalController);
  private alertController = inject(AlertController);
  private router = inject(Router);

  // Variables para el toast
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  // Variables para la lista de mantenimientos
  mantenimientos$: Observable<any[]>;
  dataSource: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  selection = new Set<string>();
  showDownloadButton: boolean = false;
  showDeleteButton: boolean = false;
  showEditButton: boolean = false;
  searchTerm: string = '';
  activeFilter: string = 'todos';
  activeFiltersCount: number = 0;
  filters = {
    estado: '',
    prioridad: '',
    categoria: '',
    taller: ''
  };
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  isLoading: boolean = true;
  isDesktop: boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Observable de vehículos
  vehiculos$: Observable<any[]>;

  constructor(private vehiculosService: VehiculosService) {
    this.vehiculos$ = this.vehiculosService.getVehiculos();
    this.mantenimientos$ = collectionData(collection(this.firestore, 'mantenimientos'), { idField: 'id' });
  }

  ngOnInit(): void {
    this.mantenimientos$.subscribe(data => {
      this.dataSource = data;
      this.applyFilters();
      this.isLoading = false;
      this.updateActionButtons();
      this.updatePagination();
    });
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  // Método para abrir el modal de agregar mantenimiento
  async abrirModalAgregarMantenimiento() {
    let vehiculos = [];
    try {
      vehiculos = await firstValueFrom(this.vehiculos$);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }

    const modal = await this.modalCtrl.create({
      component: MantenimientoModalComponent,
      componentProps: {
        vehiculos: vehiculos || []
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      try {
        // Obtener datos del vehículo para agregar la patente
        const vehiculoRef = doc(this.firestore, `vehiculos/${data.vehiculo}`);
        const vehiculoSnap = await new Promise<any>((resolve, reject) => {
          const sub = docData(vehiculoRef).subscribe({
            next: vehiculoData => {
              resolve(vehiculoData);
              sub.unsubscribe();
            },
            error: err => {
              resolve(null);
              sub.unsubscribe();
            }
          });
        });
        const patente = vehiculoSnap ? vehiculoSnap.patente : '';

        const mantenimientoData = {
          ...data,
          patente: patente
        };

        // Agregar nuevo mantenimiento a Firestore
        const docRef = await addDoc(collection(this.firestore, 'mantenimientos'), mantenimientoData);

        // Actualizar el vehículo correspondiente con el nuevo mantenimiento
        if (vehiculoSnap) {
          let mantenimientos = [];
          if (vehiculoSnap.mantenimientos) {
            mantenimientos = vehiculoSnap.mantenimientos;
          }
          mantenimientos.push({
            id: docRef.id,
            ...mantenimientoData
          });
          await setDoc(vehiculoRef, { mantenimientos, estado: data.estado }, { merge: true });
        }

        this.toastMessage = 'Mantenimiento agregado con éxito.';
        this.toastColor = 'success';
        this.showToast = true;
      } catch (error) {
        console.error('Error al agregar mantenimiento:', error);
        this.toastMessage = 'Error al agregar mantenimiento.';
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }
  }

  mostrarFiltrosAvanzados(): void {
    // Implementar modal de filtros avanzados
    console.log('Mostrando filtros avanzados...');
    this.toastMessage = 'Filtros avanzados próximamente disponibles';
    this.toastColor = 'warning';
    this.showToast = true;
  }


  // Métodos para la lista de mantenimientos
  getEstadisticas() {
    const completados = this.dataSource.filter(m => m.estado === 'Completado').length;
    const enProgreso = this.dataSource.filter(m => m.estado === 'En progreso').length;
    const pendientes = this.dataSource.filter(m => m.estado === 'Pendiente').length;
    
    const hoy = new Date();
    const proximaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    const proximosVencer = this.dataSource.filter(m => {
      if (m.Tiempomanteni && m.Tiempomanteni.length > 1) {
        const fechaFin = new Date(m.Tiempomanteni[1]);
        return fechaFin >= hoy && fechaFin <= proximaSemana && m.estado !== 'Completado';
      }
      return false;
    }).length;

    return {
      completados,
      enProgreso,
      pendientes,
      proximosVencer
    };
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.estado) count++;
    if (this.filters.prioridad) count++;
    if (this.filters.categoria) count++;
    if (this.filters.taller) count++;
    if (this.searchTerm) count++;
    return count;
  }

  handleSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.dataSource.filter(item => {
      const matchesSearch = this.searchTerm ? (
        item.patente.toLowerCase().includes(this.searchTerm) ||
        item.descripcion.toLowerCase().includes(this.searchTerm)
      ) : true;

      const matchesEstado = this.filters.estado ? item.estado === this.filters.estado : true;
      const matchesPrioridad = this.filters.prioridad ? item.prioridad === this.filters.prioridad : true;
      const matchesCategoria = this.filters.categoria ? item.categoria === this.filters.categoria : true;
      const matchesTaller = this.filters.taller ? item.tallerResponsable?.toLowerCase().includes(this.filters.taller.toLowerCase()) : true;

      return matchesSearch && matchesEstado && matchesPrioridad && matchesCategoria && matchesTaller;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters() {
    this.filters = {
      estado: '',
      prioridad: '',
      categoria: '',
      taller: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.paginatedData = this.filteredData.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
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

  updateActionButtons(): void {
    const selectedCount = this.selection.size;
    this.showDownloadButton = selectedCount > 0;
    this.showDeleteButton = selectedCount > 0;
    this.showEditButton = selectedCount === 1;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'En progreso':
        return 'tertiary';
      default:
        return 'medium';
    }
  }

  getPrioridadColor(prioridad: string): string {
    switch (prioridad) {
      case 'alta':
        return 'danger';
      case 'media':
        return 'warning';
      case 'baja':
        return 'success';
      default:
        return 'medium';
    }
  }

  formatDateRange(dateRange: any): string {
    if (!dateRange || dateRange.length !== 2) return '-';
    const start = new Date(dateRange[0]).toLocaleDateString();
    const end = new Date(dateRange[1]).toLocaleDateString();
    return `${start} - ${end}`;
  }


  editarMantenimiento(mantenimiento: any): void {
    this.router.navigate(['/editar-mantenimiento', mantenimiento.id]);
  }

  async borrarMantenimiento(mantenimiento: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Está seguro que desea borrar el mantenimiento de la patente "${mantenimiento.patente}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            try {
              await deleteDoc(doc(this.firestore, 'mantenimientos', mantenimiento.id));
              this.selection.delete(mantenimiento.id);
              this.applyFilters();
              this.updateActionButtons();
            } catch (error) {
              console.error('Error al borrar mantenimiento:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  descargarPDF(mantenimiento: any): void {
    const doc = new jsPDF();
    doc.text(`Patente: ${mantenimiento.patente}`, 10, 10);
    doc.text(`Tiempo Mantenimiento: ${new Date(mantenimiento.Tiempomanteni[0]).toLocaleDateString()} - ${new Date(mantenimiento.Tiempomanteni[1]).toLocaleDateString()}`, 10, 20);
    doc.text(`Categoría: ${mantenimiento.categoria}`, 10, 30);
    doc.text(`Prioridad: ${mantenimiento.prioridad}`, 10, 40);
    let prioridadColor = '';
    switch (mantenimiento.prioridad) {
      case 'alta':
        prioridadColor = 'Rojo';
        break;
      case 'media':
        prioridadColor = 'Amarillo';
        break;
      case 'baja':
        prioridadColor = 'Verde';
        break;
      default:
        prioridadColor = 'Sin color';
    }
    doc.text(`Prioridad: ${mantenimiento.prioridad} (${prioridadColor})`, 10, 45);
    doc.text(`Estado: ${mantenimiento.estado}`, 10, 50);
    doc.text(`Descripción: ${mantenimiento.descripcion}`, 10, 60);
    doc.text(`Taller Responsable: ${mantenimiento.tallerResponsable || 'No especificado'}`, 10, 70);
    doc.save(`mantenimiento_${mantenimiento.id}.pdf`);
  }

  sortData(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filteredData.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePagination();
  }
}
