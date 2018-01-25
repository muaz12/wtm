
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Component } from '@angular/core';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading, NavController, AlertController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import getPixels from "get-pixels";
import { DatabaseHandler } from '../../classes/DatabaseHandler';
import { LocationHandler } from '../../classes/LocationHandler';
import { Dates } from '../../classes/Dates';
import { Path } from '../../classes/Path';
import { FirebaseProvider } from '../../providers/firebase/firebase';

declare var cordova: any;

//COMPONENT
@Component({
  selector: 'page-process',
  templateUrl: 'process.html'
})
 
//CLASS
export class ProcessPage {

  //VARIABLE
  databaseObject = DatabaseHandler.getInstance();
  locationObject = LocationHandler.getInstance();
  datesObject = Dates.getInstance();
  pathObject = Path.getInstance();
  lastImage: string = null;
  ntu:number = 0;
  data: string = '';


  //CONSTRUCTOR
  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, 
              private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, 
              public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,
              public firebaseProvider: FirebaseProvider, public loading: Loading, public alertCtrl: AlertController) { 
                this.createDirectory();
              }


  /** 
   * Method Name   : checkDirectory()
   * Purpose       : to check whether directory "Water Turbidity Meter" already exists in the 
   *                 application directory or not. Return false if the directory does not exist.
   * Trigger when  : invoked by createDirectory()
  **/
  private checkDirectory(){
    this.file.checkDir(cordova.file.externalRootDirectory, 'Water Turbidity Meter').then(_ => {
      return true;
    }, (err) => {
      return false;
    });
  }
  

  /** 
   * Method Name   : createDirectory()
   * Purpose       : to create directory "Water Turbidity Meter & Images" if checkDirectory() 
   *                 returns false which means the directory need to be created since it does not exist.
   * Trigger when  : invoked by constructor()
  **/
  private createDirectory() {
    if(!this.checkDirectory()) {
      //create directory Water Turbidity Meter
      this.file.createDir(cordova.file.externalRootDirectory, 'Water Turbidity Meter', true).then(_ => {
        //create directory Images
        var path = cordova.file.externalRootDirectory + 'Water Turbidity Meter/';
        this.file.createDir(path, 'Images', true).then(_ => {}).catch(err => {});
      }).catch(err => {var error = JSON.stringify(err);});
    }
  }


  /** 
   * Method Name   : presentActionSheet()
   * Purpose       : to display action sheet that allows user to choose options whether to capture image using 
   *                 camera or select image from gallery 
   * Trigger when  : clicked "Please Select Image" Button
  **/
  private presentActionSheet() {
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
  private takePicture(sourceType) {
    //Create loading
    this.loading = this.loadingCtrl.create({
      content: 'Image Loading...',
    });
    this.loading.present();

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

      this.loading.dismissAll();
      this.presentToast('Image succesful selected.');
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
    var date = this.datesObject.getDates();
    this.locationObject.getLatitude();
    this.locationObject.getLongitude();
    return date + '.jpg';
  }

  
  /** 
   * Method Name   : copyFileToLocalDir(namePath, currentName, newFileName)
   * Purpose       : to copy image file to Application Directory
   * Trigger when  : invoked by takePicture(sourceType)
  **/
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    var path = cordova.file.externalRootDirectory + 'Water Turbidity Meter/Images/';
    this.file.copyFile(namePath, currentName, path, newFileName).then(success => {
      this.lastImage = this.pathObject.pathForImage();
    }, error => {
      this.presentToast('Error while storing image ');
    });
  }


  /** 
   * Method Name   : calculate()
   * Purpose       : to calculate NTU of image
   * Trigger when  : clicked "Start" Button
  **/  
  private calculate() {
    //Create loading
    this.loading = this.loadingCtrl.create({
      content: 'Calculating...',
    });
    this.loading.present();

    getPixels(this.lastImage, (err, pixels)=> {
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
    })
    this.loading.dismissAll();
    this.showAlert();
  }


  /** 
   * Method Name   : showAlert()
   * Purpose       : to display result in alert box
   * Trigger when  : invoked by any method
  **/
  public showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Result',
      subTitle: 'Water Turbidity: '+ this.ntu + 'NTU',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: () => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    alert.present();
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
