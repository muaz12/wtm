import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import getPixels from "get-pixels";
import {Camera, CameraOptions} from '@ionic-native/camera';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms/src/directives/default_value_accessor';

declare var cordova: any;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  lastImage: string = null;
  loading: Loading;
  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { }
  ntu:string = 'null';
  gPath;
  calculate() {
    getPixels(this.gPath, (err, pixels)=> {
      if(err) {
        console.log("Bad image path")
        return
      }
      // console.log("got pixels", pixels.data)
      // console.log("pixel size", pixels.size)
      // console.log("pixel shape", pixels.shape)
      var nx = pixels.shape[0], //width
      ny = pixels.shape[1] //height

      var meanHeight1 = 0;
      var widthSum1 = 0;
      for (var i = 0; i<nx; i++){
        var heightSum1= 0;
        for (var j = 0; j<ny; j++){
            var greyScaleEachPixel1 = ((pixels.get(i,j,0)+pixels.get(i,j,1)+pixels.get(i,j,2))/3);
            heightSum1 = heightSum1 + greyScaleEachPixel1
            // console.log("red ",pixels.get(i,j,0))
            // console.log("blue ",pixels.get(i,j,1))
            // console.log("green ",pixels.get(i,j,2))
        }
        this.ntu = meanHeight1.toString();
        meanHeight1 = heightSum1/ny;
        widthSum1 = widthSum1 +meanHeight1
        this.ntu = widthSum1.toString();
      }
      var widthMean1 = widthSum1/nx;
      this.ntu = widthMean1.toString();
      var ntu1 = 3.80*(widthMean1)+5.35;
      this.ntu = ntu1.toString()+" NTU";
    })
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }
  // Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    this.gPath = cordova.file.dataDirectory + img;
    return cordova.file.dataDirectory + img;
  }
}
}
