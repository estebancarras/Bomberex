import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarMantenimientoPage } from './editar-mantenimiento.page';

describe('EditarMantenimientoPage', () => {
  let component: EditarMantenimientoPage;
  let fixture: ComponentFixture<EditarMantenimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMantenimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
