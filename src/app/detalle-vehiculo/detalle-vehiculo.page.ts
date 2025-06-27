import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, ToastController, AlertController } from '@ionic/angular/standalone';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonItem, IonInput, IonSelect, IonSelectOption, IonSearchbar, IonFab, IonFabButton, IonList, IonCheckbox, IonChip, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  cameraOutline,
  carOutline,
  constructOutline,
  documentAttachOutline,
  informationCircleOutline,
  timeOutline,
  folderOutline,
  folderOpenOutline,
  speedometerOutline,
  createOutline,
  checkmarkCircleOutline,
  checkmarkOutline,
  buildOutline,
  documentTextOutline,
  imageOutline,
  documentOutline,
  downloadOutline,
  eyeOutline,
  trashOutline,
  closeOutline,
  addOutline,
  chevronForwardOutline,
  chevronBackOutline,
  listOutline,
  gridOutline,
  cloudUploadOutline,
  keyOutline,
  helpCircleOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { VehiculosService, Vehiculo, Mantenimiento } from '../services/vehiculos.service';
import { MantenimientoModalComponent } from '../mantenimiento/mantenimiento-modal.component';
import { ImagePreviewModalComponent } from './image-preview-modal/image-preview-modal.component';
import { HistorialDetailModalComponent } from './historial-detail-modal/historial-detail-modal.component';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: './detalle-vehiculo.page.html',
  styleUrls: ['./detalle-vehiculo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MantenimientoModalComponent,
    ImagePreviewModalComponent,
    HistorialDetailModalComponent,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonList,
    IonCheckbox,
    IonChip,
    IonSpinner,
    IonToast
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetalleVehiculoPage implements OnInit {
  segment: string = 'general';
  vehiculo$: Observable<Vehiculo | undefined> | undefined;
  editMode: boolean = false;
  originalVehiculo: Vehiculo | undefined;
  currentVehiculo: Vehiculo | undefined;
  documentos: any[] = [];
  filteredDocumentos: any[] = [];
  
  // Filtros y vista
  selectedCategory: string = 'todos';
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm: string = '';
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  
  // Historial
  selectedHistorialItems: Set<string> = new Set();
  historialSearchTerm: string = '';
  filteredHistorial: any[] = [];
  historialCurrentPage: number = 1;
  historialItemsPerPage: number = 10;
  historialTotalPages: number = 1;
  historialFilters = [
    { value: 'todos', label: 'Todos', active: true },
    { value: 'completado', label: 'Completados', active: false },
    { value: 'pendiente', label: 'Pendientes', active: false },
    { value: 'en_progreso', label: 'En Progreso', active: false }
  ];
  
  // Toast
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'success';
  
  // Categorías de documentos
  categories = [
    { value: 'todos', label: 'Todos' },
    { value: 'tecnico', label: 'Documentación Técnica' },
    { value: 'legal', label: 'Documentos Legales' },
    { value: 'mantenimiento', label: 'Mantenimientos' },
    { value: 'imagen', label: 'Imágenes' },
    { value: 'otros', label: 'Otros' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculosService: VehiculosService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    // Registrar iconos de Ionic
    addIcons({
      arrowBackOutline,
      cameraOutline,
      carOutline,
      constructOutline,
      documentAttachOutline,
      informationCircleOutline,
      timeOutline,
      folderOutline,
      folderOpenOutline,
      speedometerOutline,
      createOutline,
      checkmarkCircleOutline,
      buildOutline,
      documentTextOutline,
      imageOutline,
      documentOutline,
      downloadOutline,
      eyeOutline,
      trashOutline,
      closeOutline,
      addOutline,
      chevronForwardOutline,
      chevronBackOutline,
      listOutline,
      gridOutline,
      cloudUploadOutline,
      keyOutline,
      helpCircleOutline,
      checkmarkOutline
    });
  }

  ngOnInit() {
    this.vehiculo$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(['/vehiculos']);
          return of(undefined);
        }
        return this.vehiculosService.getVehiculoById(id);
      }),
      tap(vehiculo => {
        if (vehiculo) {
          this.currentVehiculo = vehiculo;
          this.loadDocuments();
          this.loadHistorial();
        }
      })
    );

    // Suscribirse al observable para manejar errores
    this.vehiculo$.subscribe({
      error: (error) => {
        console.error('Error al cargar el vehículo:', error);
        this.showToastMessage('Error al cargar la información del vehículo', 'danger');
        this.router.navigate(['/vehiculos']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/vehiculos']);
  }

  // Gestión de foto del vehículo
  async changeVehiclePhoto() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = false;

    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        try {
          // Validar tamaño del archivo (máximo 5MB)
          if (file.size > 5 * 1024 * 1024) {
            this.showToastMessage('La imagen es demasiado grande. Máximo 5MB.', 'warning');
            return;
          }

          const imageData = await this.fileToBase64(file);
          if (this.currentVehiculo) {
            this.currentVehiculo.imagenVehiculo = imageData;
            await this.vehiculosService.updateVehiculo(this.currentVehiculo.id!, this.currentVehiculo);
            this.showToastMessage('Foto del vehículo actualizada exitosamente', 'success');
          }
        } catch (error) {
          this.showToastMessage('Error al subir la imagen', 'danger');
        }
      }
    };

    fileInput.click();
  }

  // Métodos de estado y colores
  getStatusColor(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'operativo':
        return 'success';
      case 'en mantenimiento':
        return 'warning';
      case 'fuera de servicio':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getStatusIcon(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'operativo':
        return 'checkmark-circle-outline';
      case 'en mantenimiento':
        return 'construct-outline';
      case 'fuera de servicio':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  }

  getMaintenanceStatusColor(estado: string | undefined): string {
    if (!estado) return 'medium';
    
    switch (estado.toLowerCase()) {
      case 'completado':
        return 'success';
      case 'en progreso':
        return 'warning';
      case 'pendiente':
        return 'medium';
      case 'cancelado':
        return 'danger';
      default:
        return 'medium';
    }
  }

  getEstadoColor(estado: string | undefined): string {
    return this.getMaintenanceStatusColor(estado);
  }

  // Métodos de edición
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.originalVehiculo = { ...this.currentVehiculo! };
    }
  }

  async cancelEdit() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar cancelación',
      message: '¿Estás seguro de que deseas cancelar los cambios?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.editMode = false;
            if (this.originalVehiculo && this.currentVehiculo) {
              Object.assign(this.currentVehiculo, this.originalVehiculo);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async guardarCambios() {
    if (!this.currentVehiculo?.id) return;

    try {
      await this.vehiculosService.updateVehiculo(this.currentVehiculo.id, this.currentVehiculo);
      this.editMode = false;
      this.showToastMessage('Cambios guardados exitosamente', 'success');
    } catch (error) {
      this.showToastMessage('Error al guardar los cambios', 'danger');
    }
  }

  // Métodos de mantenimiento
  async agregarMantenimiento() {
    if (!this.currentVehiculo) return;

    const modal = await this.modalCtrl.create({
      component: MantenimientoModalComponent,
      componentProps: {
        vehiculos: [this.currentVehiculo]
      }
    });

    await modal.present();

    const { data: nuevoMantenimiento, role } = await modal.onDidDismiss();
    
    if (role === 'cancel' || !nuevoMantenimiento) return;

    try {
      // Asegurarse de que el vehículo tiene un array de mantenimientos
      if (!this.currentVehiculo.mantenimientos) {
        this.currentVehiculo.mantenimientos = [];
      }

      // Crear el objeto de mantenimiento
      const mantenimiento: Mantenimiento = {
        fecha: nuevoMantenimiento.Tiempomanteni[0],
        tipo: nuevoMantenimiento.tipo,
        descripcion: nuevoMantenimiento.descripcion
      };

      // Agregar el mantenimiento al array
      this.currentVehiculo.mantenimientos.push(mantenimiento);

      // Actualizar el vehículo en la base de datos
      await this.vehiculosService.updateVehiculo(this.currentVehiculo.id!, this.currentVehiculo);

      this.showToastMessage('Mantenimiento agregado exitosamente', 'success');
      this.loadHistorial(); // Recargar historial
    } catch (error) {
      this.showToastMessage('Error al agregar el mantenimiento', 'danger');
    }
  }

  // Métodos de historial
  loadHistorial() {
    // Simular carga de historial desde mantenimientos completados
    if (this.currentVehiculo?.mantenimientos) {
      this.filteredHistorial = [...this.currentVehiculo.mantenimientos].map((m, index) => ({
        ...m,
        id: `hist_${index}`,
        estado: m.estado || 'Completado',
        categoria: m.tipo || 'General',
        selected: false
      }));
    } else {
      this.filteredHistorial = [];
    }
    this.updateHistorialPagination();
  }

  filterHistorial() {
    let filtered = [...(this.currentVehiculo?.mantenimientos || [])];
    
    // Filtrar por término de búsqueda
    if (this.historialSearchTerm) {
      const term = this.historialSearchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.tipo?.toLowerCase().includes(term) || 
        item.descripcion?.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por estado activo
    const activeFilter = this.historialFilters.find(f => f.active);
    if (activeFilter && activeFilter.value !== 'todos') {
      filtered = filtered.filter(item => {
        const estado = item.estado?.toLowerCase() || 'completado';
        return estado === activeFilter.value.replace('_', ' ');
      });
    }
    
    this.filteredHistorial = filtered.map((m, index) => ({
      ...m,
      id: `hist_${index}`,
      estado: m.estado || 'Completado',
      categoria: m.tipo || 'General',
      selected: false
    }));
    
    this.historialCurrentPage = 1;
    this.updateHistorialPagination();
  }

  toggleHistorialFilter(filter: any) {
    this.historialFilters.forEach(f => f.active = false);
    filter.active = true;
    this.filterHistorial();
  }

  getPagedHistorial() {
    const startIndex = (this.historialCurrentPage - 1) * this.historialItemsPerPage;
    return this.filteredHistorial.slice(startIndex, startIndex + this.historialItemsPerPage);
  }

  updateHistorialPagination() {
    this.historialTotalPages = Math.ceil(this.filteredHistorial.length / this.historialItemsPerPage);
  }

  toggleHistorialSelection(item: any) {
    if (item.selected) {
      this.selectedHistorialItems.add(item.id);
    } else {
      this.selectedHistorialItems.delete(item.id);
    }
  }

  clearSelection() {
    this.selectedHistorialItems.clear();
    this.filteredHistorial.forEach(item => item.selected = false);
  }

  async viewHistorialDetail(item: any) {
    const modal = await this.modalCtrl.create({
      component: HistorialDetailModalComponent,
      componentProps: {
        mantenimiento: item
      }
    });
    await modal.present();
  }

  async downloadSelectedPDF() {
    const selectedItems = this.filteredHistorial.filter(item => 
      this.selectedHistorialItems.has(item.id)
    );

    if (selectedItems.length === 0) return;

    try {
      const doc = new jsPDF();
      
      // Título del documento
      doc.setFontSize(16);
      doc.text(`Historial de Mantenimientos - ${this.currentVehiculo?.vehiculo}`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Patente: ${this.currentVehiculo?.patente}`, 20, 30);
      
      let yPosition = 50;
      
      selectedItems.forEach((item, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.text(`${index + 1}. ${item.tipo || 'Mantenimiento'}`, 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Fecha: ${this.formatDate(item.fecha)}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Estado: ${item.estado}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Descripción: ${item.descripcion || 'Sin descripción'}`, 25, yPosition);
        yPosition += 15;
      });
      
      doc.save(`historial_${this.currentVehiculo?.patente}_${new Date().toISOString().split('T')[0]}.pdf`);
      this.showToastMessage('PDF descargado exitosamente', 'success');
    } catch (error) {
      this.showToastMessage('Error al generar el PDF', 'danger');
    }
  }

  nextHistorialPage() {
    if (this.historialCurrentPage < this.historialTotalPages) {
      this.historialCurrentPage++;
    }
  }

  previousHistorialPage() {
    if (this.historialCurrentPage > 1) {
      this.historialCurrentPage--;
    }
  }

  // Métodos de documentos
  loadDocuments() {
    const vehiculoId = this.currentVehiculo?.id;
    if (vehiculoId) {
      const savedDocs = localStorage.getItem(`documentos_${vehiculoId}`);
      if (savedDocs) {
        this.documentos = JSON.parse(savedDocs);
      } else {
        this.documentos = [
          {
            id: '1',
            nombre: 'Revisión Técnica',
            archivo: 'revision_tecnica_2024.pdf',
            tipo: 'pdf',
            fecha: '2024-03-15',
            tamano: '2.5 MB',
            categoria: 'legal'
          },
          {
            id: '2',
            nombre: 'Foto del Vehículo',
            archivo: 'vehiculo_frontal.jpg',
            tipo: 'imagen',
            fecha: '2024-03-10',
            tamano: '1.8 MB',
            categoria: 'imagen'
          }
        ];
        this.saveDocuments();
      }
    }
    this.filterDocuments();
  }

  saveDocuments() {
    const vehiculoId = this.currentVehiculo?.id;
    if (vehiculoId) {
      localStorage.setItem(`documentos_${vehiculoId}`, JSON.stringify(this.documentos));
    }
  }

  async uploadDocument() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    fileInput.multiple = true;

    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          try {
            if (file.size > 10 * 1024 * 1024) {
              this.showToastMessage(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`, 'warning');
              continue;
            }

            const nuevoDocumento = {
              id: Date.now().toString() + i,
              nombre: this.getDocumentName(file.name),
              archivo: file.name,
              tipo: this.getDocumentType(file.type),
              fecha: new Date().toISOString().split('T')[0],
              tamano: this.formatFileSize(file.size),
              categoria: this.getDocumentCategory(file.type),
              data: await this.fileToBase64(file)
            };

            this.documentos.push(nuevoDocumento);
          } catch (error) {
            this.showToastMessage(`Error al procesar ${file.name}`, 'danger');
          }
        }
        
        this.saveDocuments();
        this.filterDocuments();
        this.showToastMessage('Documentos subidos exitosamente', 'success');
      }
    };

    fileInput.click();
  }

  toggleDocumentView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterDocuments();
  }

  filterDocuments() {
    let filtered = [...this.documentos];
    
    if (this.selectedCategory !== 'todos') {
      filtered = filtered.filter(doc => doc.categoria === this.selectedCategory);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.nombre.toLowerCase().includes(term) || 
        doc.archivo.toLowerCase().includes(term)
      );
    }
    
    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    this.filteredDocumentos = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPagedDocuments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDocumentos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getDocumentIcon(tipo: string): string {
    switch (tipo) {
      case 'pdf':
        return 'document-text-outline';
      case 'imagen':
        return 'image-outline';
      case 'documento':
        return 'document-outline';
      default:
        return 'folder-outline';
    }
  }

  async previewDocument(documento: any) {
    if (documento.tipo === 'imagen') {
      const modal = await this.modalCtrl.create({
        component: ImagePreviewModalComponent,
        componentProps: {
          imageUrl: documento.data
        }
      });
      await modal.present();
    } else if (documento.tipo === 'pdf') {
      const pdfWindow = window.open('');
      pdfWindow?.document.write(
        `<iframe width='100%' height='100%' src='${documento.data}'></iframe>`
      );
    }
  }

  async downloadDocument(documentName: string) {
    try {
      const documento = this.documentos.find(doc => doc.archivo === documentName);
      if (!documento) throw new Error('Documento no encontrado');

      const link = document.createElement('a');
      link.href = documento.data;
      link.download = documento.archivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showToastMessage(`Descargando ${documentName}...`, 'success');
    } catch (error) {
      this.showToastMessage('Error al descargar el archivo', 'danger');
    }
  }

  async deleteDocument(documentName: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar ${documentName}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const index = this.documentos.findIndex(doc => doc.archivo === documentName);
              if (index > -1) {
                this.documentos.splice(index, 1);
                this.saveDocuments();
                this.filterDocuments();
              }

              this.showToastMessage('Documento eliminado exitosamente', 'success');
            } catch (error) {
              this.showToastMessage('Error al eliminar el documento', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Métodos auxiliares
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private getDocumentName(fileName: string): string {
    const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    return nameWithoutExtension.charAt(0).toUpperCase() + nameWithoutExtension.slice(1);
  }

  private getDocumentType(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'imagen';
    return 'documento';
  }

  private getDocumentCategory(mimeType: string): string {
    if (mimeType.includes('image')) return 'imagen';
    if (mimeType.includes('pdf')) return 'legal';
    return 'otros';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: string): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
