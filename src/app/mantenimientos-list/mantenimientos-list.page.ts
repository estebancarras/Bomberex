import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';

import { addIcons } from 'ionicons';
import { downloadOutline, createOutline, trashOutline, filterOutline, calendarOutline, addCircleOutline, chevronBackOutline, chevronForwardOutline, closeOutline, clipboardOutline, arrowDownOutline } from 'ionicons/icons';

import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton, IonMenuButton,
  IonSearchbar, IonChip, IonLabel, IonIcon, IonSegment, IonSegmentButton,
  IonItem, IonList, IonItemSliding, IonItemOptions, IonItemOption,
  IonCheckbox, IonGrid, IonRow, IonCol, IonNote, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonSelect, IonSelectOption, IonInput,
  IonSpinner
} from "@ionic/angular/standalone";


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
  'arrow-down': arrowDownOutline
});

@Component({
  selector: 'app-mantenimientos-list',
  templateUrl: './mantenimientos-list.page.html',
  styleUrls: ['./mantenimientos-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton, IonMenuButton,
    IonSearchbar, IonChip, IonLabel, IonIcon, IonSegment, IonSegmentButton,
    IonItem, IonList, IonItemSliding, IonItemOptions, IonItemOption,
    IonCheckbox, IonGrid, IonRow, IonCol, IonNote, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonSelect, IonSelectOption, IonInput,
    IonSpinner
  ]
})
export class MantenimientosListPage implements OnInit {
  private firestore = inject(Firestore);
  private alertController = inject(AlertController);
  // Eliminado modalController porque no está importado ni usado
  public router = inject(Router);

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

  constructor() {
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

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.filteredData.forEach((row: any) => this.selection.add(row.id));
    }
    this.updateActionButtons();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.size;
    const numRows = this.filteredData.length;
    return numSelected === numRows && numRows > 0;
  }

  isIndeterminate(): boolean {
    const numSelected = this.selection.size;
    const numRows = this.filteredData.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleSelection(id: string): void {
    if (this.selection.has(id)) {
      this.selection.delete(id);
    } else {
      this.selection.add(id);
    }
    this.updateActionButtons();
  }

  isSelected(id: string): boolean {
    return this.selection.has(id);
  }

  updateActionButtons(): void {
    const selectedCount = this.selection.size;
    this.showDownloadButton = selectedCount > 0;
    this.showDeleteButton = selectedCount > 0;
    this.showEditButton = selectedCount === 1;
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

  descargarSeleccionados(): void {
    this.selection.forEach(id => {
      const mantenimiento = this.filteredData.find(item => item.id === id);
      if (mantenimiento) {
        this.descargarPDF(mantenimiento);
      }
    });
  }

  editarSeleccionado(): void {
    if (this.selection.size === 1) {
      const id = Array.from(this.selection)[0];
      this.router.navigate(['/editar-mantenimiento', id]);
    }
  }

  async borrarSeleccionados(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Está seguro que desea borrar los mantenimientos seleccionados?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            try {
              for (const id of this.selection) {
                await deleteDoc(doc(this.firestore, 'mantenimientos', id));
              }
              this.selection.clear();
              this.applyFilters();
              this.updateActionButtons();
            } catch (error) {
              console.error('Error al borrar mantenimientos:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  openFilterModal(): void {
    // Aquí se puede implementar la apertura de un modal para filtros avanzados si se desea
    console.log('Abrir modal de filtros avanzados');
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
