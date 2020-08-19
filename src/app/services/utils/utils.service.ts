import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private toastController: ToastController) {}

  async presentToast(message: string, btns = [], duration = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration,
      buttons: btns,
      color: '#eb445a',
    });
    return await toast.present();
  }
}
