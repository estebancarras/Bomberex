import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-image-preview-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="image-container">
        <img [src]="imageUrl" alt="Preview" />
      </div>
    </ion-content>
  `,
  styles: [`
    .image-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      
      img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
      }
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ImagePreviewModalComponent {
  @Input() imageUrl!: string;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
