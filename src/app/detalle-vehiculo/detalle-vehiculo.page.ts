import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VehiculosService, Vehiculo } from '../services/vehiculos.service';

@Component({
  selector: 'app-detalle-vehiculo',
  templateUrl: './detalle-vehiculo.page.html',
  styleUrls: ['./detalle-vehiculo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetalleVehiculoPage implements OnInit {
  segment: string = 'general';
  vehiculo$: Observable<Vehiculo | undefined> | undefined;

  constructor(private route: ActivatedRoute, private vehiculosService: VehiculosService) {}

  ngOnInit() {
    this.vehiculo$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of(undefined);
        }
        return this.vehiculosService.getVehiculoById(id);
      })
    );
  }

  guardarCambios() {
    // Aquí se implementaría la lógica para guardar los cambios realizados
    console.log('Cambios guardados');
  }
}
