
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import getPixels from "get-pixels";
import {Camera, CameraOptions} from '@ionic-native/camera';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms/src/directives/default_value_accessor';
import { Storage } from '@ionic/storage';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

declare var cordova: any;

//COMPONENT
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

//CLASS
export class AboutPage {

  //VARIABLE
  lastImage: string = null;
  loading: Loading;
  ntu:number = 0;
  result:string = 'null';
  gPath: string = 'null';
  

  //CONSTRUCTOR
  constructor(public storage: Storage, public navCtrl: NavController, private camera: Camera, 
              private transfer: Transfer, private file: File, private filePath: FilePath, 
              public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, 
              public platform: Platform, public loadingCtrl: LoadingController) { }


  /** 
   * Method Name   : presentActionSheet()
   * Purpose       : to display action sheet that allows user to choose options whether to capture image using 
   *                 camera or select image from gallery 
   * Trigger when  : clicked "Please Select Image" Button
  **/
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


  /** 
   * Method Name   : takePicture(sourceType)
   * Purpose       : to capture picture of water using phone camera or to choose picture from Gallery
   * Trigger when  : invoked by presentActionSheet()
  **/
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
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
 

  /** 
   * Method Name   : createFileName()
   * Purpose       : to rename captured image (image from Camera) / to rename selected image (image from Gallery)
   * Trigger when  : invoked by takePicture(sourceType)
  **/
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n;
    return newFileName;
  }

  
  /** 
   * Method Name   : copyFileToLocalDir(namePath, currentName, newFileName)
   * Purpose       : to transfer image to Application Directory
   * Trigger when  : invoked by takePicture(sourceType)
  **/
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.createDirectory();
    //var path = cordova.file.externalRootDirectory + 'Water Turbidity Meter/Water images';
    this.file.copyFile(namePath, currentName, cordova.file.externalRootDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }


  /** 
   * Method Name   : checkDirectory()
   * Purpose       : to check whether directory "Water Turbidity Meter/Water images" already exists in the 
   *                 application directory or not. Return false if the directory does not exist.
   * Trigger when  : invoked by createDirectory()
  **/
  public checkDirectory(){
    this.file.checkDir(cordova.file.externalRootDirectory, "Water Turbidity Meter/Water images/").then(_ => {
      return true;
    }, (err) => {
      this.presentToast(' ' + err);
      return false;
    });
  }
  

  /** 
   * Method Name   : createDirectory()
   * Purpose       : to create directory "Water Turbidity Meter/Water images" if checkDirectory() returns 
   *                 false which means the directory need to be created since it does not exist.
   * Trigger when  : invoked by copyFileToLocalDir(namePath, currentName, newFileName)
  **/
  public createDirectory() {
    if(!this.checkDirectory()) {
      this.file.createDir(cordova.file.externalRootDirectory, "Water Turbidity Meter/Water images/", false).then(_ => console.log('Directory exists')
      ).catch(err => {
        console.log(err);
        var error = JSON.stringify(err);
        this.presentToast(' ' + error);
      });
    }
  }
  

  /** 
   * Method Name   : pathForImage(img)
   * Purpose       : to show image in Application
   * Trigger when  : clicked "Please Select Image" Button
  **/
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      this.gPath = cordova.file.externalRootDirectory + img;
      return cordova.file.externalRootDirectory + img;
    }
  }


  /** 
   * Method Name   : calculate()
   * Purpose       : to calculate NTU of image
   * Trigger when  : clicked "Start" Button
  **/  
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
        meanHeight1 = heightSum1/ny;
        widthSum1 = widthSum1 +meanHeight1
      }
      var widthMean1 = widthSum1/nx;
      var ntu1 = 3.80*(widthMean1)+5.35;
      this.ntu = ntu1;
      this.storeResult(ntu1);
    })
  }


  /** 
   * Method Name   : storeResult(ntu1)
   * Purpose       : to store result in database
   * Trigger when  : invoked by 
  **/
  public storeResult(ntu1) {
    this.storage.ready().then(() => {
      this.storage.set('NTU Index', ntu1);
     });

    this.storage.get('NTU Index').then((data) => {
      if(data != null) {
        console.log(data);
        this.result = data;
      }
    });
  }


  /** 
   * Method Name   : presentToast(text)
   * Purpose       : to display toast (message box)
   * Trigger when  : invoked by any method
  **/
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
