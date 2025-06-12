import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: './detalle-vehiculo.page.html',
  styleUrls: ['./detalle-vehiculo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetalleVehiculoPage {
  segment: string = 'general';
  vehiculo$: Observable<any>;

  constructor(private route: ActivatedRoute) {
    // Simulación de datos, en producción se obtendrían de un servicio
    this.vehiculo$ = of({
      nombre: 'Camión de Bomberos 1',
      estado: 'Operativo',
      modelo: 'Modelo A',
      anio: 2015,
      mantenimientos: [
        { fecha: '2023-01-10', tipo: 'Revisión', descripcion: 'Cambio de aceite' },
        { fecha: '2023-03-15', tipo: 'Reparación', descripcion: 'Frenos' }
      ]
    });
  }

  guardarCambios() {
    // Aquí se implementaría la lógica para guardar los cambios realizados
    console.log('Cambios guardados');
  }
}
