import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonMenuButton, IonGrid, IonRow, IonCol, IonBadge, IonItem, IonLabel, IonList, IonAvatar, IonChip, IonSearchbar, IonSegment, IonSegmentButton, IonButtons } from '@ionic/angular/standalone';

import { AuthService } from '../services/auth.service';
import { VehiculosService, Vehiculo } from '../services/vehiculos.service';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { User } from '@angular/fire/auth';

import { addIcons } from 'ionicons';
import { 
  carSportOutline, 
  checkmarkCircleOutline,
  buildOutline,
  warningOutline,
  addCircleOutline,
  listOutline,
  calendarOutline,
  alertCircleOutline,
  chevronForwardOutline,
  shieldOutline,
  menuOutline,
  personOutline,
  carSport,
  checkmarkCircle,
  build,
  warning,
  calendar,
  alertCircle,
  chevronForward,
  shield
} from 'ionicons/icons';

Chart.register(...registerables);

// Registrar todos los iconos necesarios
addIcons({
  'car-sport-outline': carSportOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'build-outline': buildOutline,
  'warning-outline': warningOutline,
  'add-circle-outline': addCircleOutline,
  'list-outline': listOutline,
  'calendar-outline': calendarOutline,
  'alert-circle-outline': alertCircleOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'shield-outline': shieldOutline,
  'menu-outline': menuOutline,
  'person-outline': personOutline,
  'car-sport': carSport,
  'checkmark-circle': checkmarkCircle,
  'build': build,
  'warning': warning,
  'calendar': calendar,
  'alert-circle': alertCircle,
  'chevron-forward': chevronForward,
  'shield': shield
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonIcon, 
    IonMenuButton, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonBadge, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonAvatar, 
    IonChip, 
    IonSearchbar, 
    IonSegment, 
    IonSegmentButton,
    IonButtons
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('vehiculosChart') vehiculosChart!: ElementRef;
  @ViewChild('mantenimientosEstadoChart') mantenimientosEstadoChart!: ElementRef;

  // Usuario
  usuario = 'Bombero';
  isAdmin = false;
  currentUser: User | null = null;

  // Contadores principales
  vehiculos: Vehiculo[] = [];
  totalVehiculos = 0;
  vehiculosOperativos = 0;
  vehiculosEnMantenimiento = 0;
  vehiculosInoperativos = 0;
  mantenimientosPendientes = 0;
  mantenimientosEnProgreso = 0;
  mantenimientosCompletados = 0;

  // UI State
  selectedSegment = 'dashboard';
  selectedChart = 'vehiculos'; // 'vehiculos' o 'mantenimientos'
  
  // Datos para mostrar
  alertas: any[] = [];
  proximosMantenimientos: any[] = [];

  // Charts
  private subscriptions: Subscription[] = [];
  private chartVehiculos: Chart | null = null;
  private chartMantenimientosEstado: Chart | null = null;

  constructor(
    public router: Router,
    private authService: AuthService,
    private vehiculosService: VehiculosService
  ) {
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = (role === 'admin');
    });

    const userSub = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.usuario = user?.displayName || user?.email || 'Bombero';
    });
    this.subscriptions.push(userSub);

    const vehiculosSub = this.vehiculosService.getVehiculos().subscribe(vehiculos => {
      this.vehiculos = vehiculos;
      this.calcularResumen();
      this.generarAlertas();
      this.calcularProximosMantenimientos();
      this.updateCharts();
    });
    this.subscriptions.push(vehiculosSub);
  }

  ngOnInit() {
    setTimeout(() => {
      this.createCharts();
    }, 500);
  }

  toggleChart() {
    this.selectedChart = this.selectedChart === 'vehiculos' ? 'mantenimientos' : 'vehiculos';
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }

  calcularResumen() {
    // Resumen de Vehículos
    this.totalVehiculos = this.vehiculos.length;
    this.vehiculosOperativos = this.vehiculos.filter(v => v.estado === 'Operativo').length;
    this.vehiculosEnMantenimiento = this.vehiculos.filter(v => v.estado === 'En mantenimiento').length;
    this.vehiculosInoperativos = this.vehiculos.filter(v => v.estado === 'Fuera de servicio').length;

    // Resumen de Mantenimientos
    this.mantenimientosPendientes = 0;
    this.mantenimientosEnProgreso = 0;
    this.mantenimientosCompletados = 0;

    this.vehiculos.forEach(vehiculo => {
      vehiculo.mantenimientos?.forEach(m => {
        if (m.estado) {
          switch (m.estado) {
            case 'Pendiente':
              this.mantenimientosPendientes++;
              break;
            case 'En progreso':
              this.mantenimientosEnProgreso++;
              break;
            case 'Completado':
              this.mantenimientosCompletados++;
              break;
          }
        }
      });
    });
  }

  generarAlertas() {
    this.alertas = [];
    
    if (this.vehiculosInoperativos > 0) {
      this.alertas.push({
        tipo: 'danger',
        icono: 'warning',
        titulo: 'Vehículos Inoperativos',
        mensaje: `${this.vehiculosInoperativos} vehículo(s) fuera de servicio`,
        accion: () => this.navegarConFiltro('Fuera de servicio')
      });
    }

    if (this.mantenimientosPendientes > 3) {
      this.alertas.push({
        tipo: 'warning',
        icono: 'build',
        titulo: 'Mantenimientos Pendientes',
        mensaje: `${this.mantenimientosPendientes} mantenimientos requieren atención`,
        accion: () => this.navegarAMantenimientos({ estado: 'Pendiente' })
      });
    }

    const porcentajeOperativo = this.totalVehiculos > 0 ? (this.vehiculosOperativos / this.totalVehiculos) * 100 : 0;
    if (porcentajeOperativo < 70 && this.totalVehiculos > 0) {
      this.alertas.push({
        tipo: 'danger',
        icono: 'alert-circle',
        titulo: 'Capacidad Operativa Baja',
        mensaje: `Solo ${porcentajeOperativo.toFixed(1)}% de la flota está operativa`,
        accion: () => this.navegarConFiltro('Operativo')
      });
    }
  }

  calcularProximosMantenimientos() {
    this.proximosMantenimientos = [];
    const hoy = new Date();
    const proximosDias = new Date();
    proximosDias.setDate(hoy.getDate() + 30);

    this.vehiculos.forEach(vehiculo => {
      vehiculo.mantenimientos?.forEach(mantenimiento => {
        const fechaMantenimiento = new Date(mantenimiento.fecha);
        if (fechaMantenimiento >= hoy && fechaMantenimiento <= proximosDias && 
            mantenimiento.estado === 'Pendiente') {
          this.proximosMantenimientos.push({
            vehiculo: vehiculo.nombre,
            vehiculoId: vehiculo.id,
            tipo: mantenimiento.tipo,
            fecha: mantenimiento.fecha,
            descripcion: mantenimiento.descripcion,
            diasRestantes: Math.ceil((fechaMantenimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24))
          });
        }
      });
    });

    this.proximosMantenimientos.sort((a, b) => a.diasRestantes - b.diasRestantes);
  }

  createCharts() {
    if (this.selectedChart === 'vehiculos') {
      this.createVehiculosChart();
    } else {
      this.createMantenimientosEstadoChart();
    }
  }

  createVehiculosChart() {
    if (this.vehiculosChart?.nativeElement) {
      if (this.chartVehiculos) {
        this.chartVehiculos.destroy();
      }
      
      const ctx = this.vehiculosChart.nativeElement.getContext('2d');
      
      this.chartVehiculos = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Operativos', 'En Mantenimiento', 'Inoperativos'],
          datasets: [{
            data: [this.vehiculosOperativos, this.vehiculosEnMantenimiento, this.vehiculosInoperativos],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
    }
  }

  createMantenimientosEstadoChart() {
    if (this.mantenimientosEstadoChart?.nativeElement) {
      if (this.chartMantenimientosEstado) {
        this.chartMantenimientosEstado.destroy();
      }
      
      const ctx = this.mantenimientosEstadoChart.nativeElement.getContext('2d');
      
      this.chartMantenimientosEstado = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Pendientes', 'En Progreso', 'Completados'],
          datasets: [{
            label: 'Mantenimientos',
            data: [this.mantenimientosPendientes, this.mantenimientosEnProgreso, this.mantenimientosCompletados],
            backgroundColor: ['#dc3545', '#ffc107', '#28a745']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  size: 10
                }
              }
            },
            x: {
              ticks: {
                font: {
                  size: 10
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }

  updateCharts() {
    if (this.selectedChart === 'vehiculos' && this.chartVehiculos) {
      this.chartVehiculos.data.datasets[0].data = [
        this.vehiculosOperativos,
        this.vehiculosEnMantenimiento,
        this.vehiculosInoperativos
      ];
      this.chartVehiculos.update();
    }

    if (this.selectedChart === 'mantenimientos' && this.chartMantenimientosEstado) {
      this.chartMantenimientosEstado.data.datasets[0].data = [
        this.mantenimientosPendientes,
        this.mantenimientosEnProgreso,
        this.mantenimientosCompletados
      ];
      this.chartMantenimientosEstado.update();
    }
  }

  // Métodos de navegación
  navegarConFiltro(estado?: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    if (estado) {
      navigationExtras.queryParams = { estado: estado };
    }

    this.router.navigate(['/vehiculos'], navigationExtras);
  }

  navegarAMantenimientos(filtro?: { tipo?: string, estado?: string, prioridad?: string }) {
    let navigationExtras: NavigationExtras = {
      queryParams: { ...filtro }
    };

    this.router.navigate(['/mantenimiento'], navigationExtras);
  }

  verTodosVehiculos() {
    this.navegarConFiltro();
  }

  verVehiculosOperativos() {
    this.navegarConFiltro('Operativo');
  }

  verMantenimientosPorEstado(estado: string) {
    this.navegarAMantenimientos({ estado });
  }

  navegarAPerfil() {
    this.router.navigate(['/perfil']);
  }

  navegarAVehiculo(vehiculoId: string) {
    this.router.navigate(['/detalle-vehiculo', vehiculoId]);
  }

  navegarAMantenimiento() {
    this.router.navigate(['/mantenimiento']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    if (this.chartVehiculos) {
      this.chartVehiculos.destroy();
    }
    if (this.chartMantenimientosEstado) {
      this.chartMantenimientosEstado.destroy();
    }
  }
}
