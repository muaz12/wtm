
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import getPixels from "get-pixels";
import { Camera } from '@ionic-native/camera';
import { ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Dates } from '../../classes/Dates';
import { DatabaseHandler } from '../../classes/DatabaseHandler';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
declare var cordova: any;

//COMPONENT
@Component({
  selector: 'page-process',
  templateUrl: 'process.html'
})
 
//CLASS
export class ProcessPage {

  //VARIABLE
  datesss = Dates.getInstance();
  databasessss = DatabaseHandler.getInstance();
  lastImage: string = null;
  loading: Loading;
  ntu:number = 0;
  result:string = 'null';
  gPath: string = 'null';
  errorLog: string = this.datesss.getDates();
  data: string = '';


  //CONSTRUCTOR
  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, 
              private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, 
              public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,
              private sqlite: SQLite) { 
                //this.createDirectory();
                //this.databaseHandler.createTable();
                //.createTable();
                //new DatabaseHandler().createTable();
                
              }
  

  public updateLog() {
    this.data = this.data + ', ' + this.datesss.getLog();
    this.data = this.data + ', ' + this.databasessss.getLog();
  }


  /** 
   * Method Name   : checkDirectory()
   * Purpose       : to check whether directory "Water Turbidity Meter" already exists in the 
   *                 application directory or not. Return false if the directory does not exist.
   * Trigger when  : invoked by createDirectory()
  **/
  public checkDirectory(){
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
  public createDirectory() {
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
 

  /** 
   * Method Name   : createFileName()
   * Purpose       : to rename captured image (image from Camera) / to rename selected image (image from Gallery)
   * Trigger when  : invoked by takePicture(sourceType)
  **/
  private createFileName() {
    var date = 'vvv';
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
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing image ');
    });
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
      this.gPath = cordova.file.externalRootDirectory + 'Water Turbidity Meter/Images/' + img;
      return this.gPath;
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
    })
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
