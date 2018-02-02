
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

//PROVIDER
@Injectable()
export class UiProvider {

  //CONSTRUCTOR
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public toastCtrl: ToastController) {}

  
  /** 
   * Method Name   : createLoading(text)
   * Purpose       : to create loading
   * Trigger when  : invoked by any method
  **/
  public createLoading(text){
    return this.loadingCtrl.create({
      content: text,
    });
  }


  /** 
   * Method Name   : showAlert()
   * Purpose       : to create and display alert box
   * Trigger when  : invoked by any method
  **/
  public showAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
          }
        }
      ]
    });
    alert.present();
  }


  /** 
   * Method Name   : presentToast(text)
   * Purpose       : to create and display toast (message box)
   * Trigger when  : invoked by any method
  **/
  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
