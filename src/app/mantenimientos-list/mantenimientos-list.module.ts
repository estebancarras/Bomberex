import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { MantenimientosListPage } from './mantenimientos-list.page';

const routes = [
  {
    path: '',
    component: MantenimientosListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MantenimientosListPage]
})
export class MantenimientosListPageModule {}