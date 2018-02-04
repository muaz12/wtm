
//REQUIRED LIBRARY AND DEPENDENCIES
import { DirectoryHandler } from './DirectoryHandler';

declare var cordova: any;
declare var firebase: any;
declare global {
  interface Window { resolveLocalFileSystemURL: any }
}

//CLASS
export class FirebaseStorage {

  //VARIABLE
  static firebaseStorageObject: FirebaseStorage;
  directoryObject = DirectoryHandler.getInstance();
  uploadTask;
  url;


  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of FirebaseStorage class
   * Trigger when  : invoked by FirebaseDatabase
   **/
  public static getInstance() {
    if(!this.firebaseStorageObject){
      this.firebaseStorageObject = new FirebaseStorage();
    }
    return this.firebaseStorageObject;
  } 


  /** 
   * Method Name   : getInstanceOfStorage()
   * Purpose       : to get the reference of firebase storage
   * Trigger when  : invoked by uploadImage(fileName), downloadImage(fileName), deleteImage(fileName)
  **/
  public getInstanceOfStorage() {
    return firebase.storage().ref('Water Turbidity Meter/Images');
  }


  /** 
   * Method Name   : uploadImage()
   * Purpose       : to upload image to firebase storage
   * Trigger when  : invoked by pushDataToFirebase(ntu)
  **/
  public uploadImage(fileName) {
    var file;

    this.directoryObject.getFile().readAsDataURL(this.directoryObject.getPath(), fileName).then((data) => {
      file = data;
      
      this.uploadTask = this.getInstanceOfStorage().child(fileName).putString(file, 'data_url').then(() => {
        console.log('Uploaded image!');
      }).catch((err) => console.log(err));

      this.monitor();

    }).catch((err) => console.log(err));
  }


  /** 
   * Method Name   : monitor()
   * Purpose       : to monitor the progress of uploading the image to firebase storage
   * Trigger when  : invoked by uploadImage()
  **/
  public monitor() {
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
      
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      this.log = this.log + 'Upload is ' + progress + '% done';

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: {
          console.log('Upload is paused');
          break;
        }
        case firebase.storage.TaskState.RUNNING: {
          console.log('Upload is running');
          break;
        }
      }
    }, function(error) {
        this.log = this.log + ' , Upload failed , ';
        console.log('Upload failed');
    });
  }


  /** 
   * Method Name   : pauseUpload()
   * Purpose       : to pause the upload of image to firebase storage
   * Trigger when  : invoked by any method
  **/
  public pauseUpload() {
    this.uploadTask.pause();
  }


  /** 
   * Method Name   : resumeUpload()
   * Purpose       : to resume the upload of image to firebase storage
   * Trigger when  : invoked by any method
  **/
  public resumeUpload() {
    this.uploadTask.resume();
  }


  /** 
   * Method Name   : cancelUpload()
   * Purpose       : to cancel the upload of image to firebase storage
   * Trigger when  : invoked by any method
  **/
  public cancelUpload() {
    this.uploadTask.cancel();
  }


  /** 
   * Method Name   : dowloadImage()
   * Purpose       : to download image from firebase storage
   * Trigger when  : invoked by FirebaseDatabase pullDataFromFirebase()
  **/
  public dowloadImage(fileName) {
    var blob = null;
    
    this.getInstanceOfStorage().child('' + fileName).getDownloadURL().then(function(url) {
      
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open('GET', url, true);

      xhr.onload = function(event) {
        blob = xhr.response;
        
        if(blob){ 
          var folderPath = cordova.file.externalRootDirectory + 'Water Turbidity Meter/Images/';
          window.resolveLocalFileSystemURL(folderPath, function(dir) {
            dir.getFile(fileName, {create:true}, function(file) {
              file.createWriter(function(fileWriter) {
              fileWriter.write(blob);
              }, function(){
                console.log('Unable to save file in path ' + folderPath);
              });
            });
          });
        }
      };
      xhr.send();

    }).catch(function(error) {
      console.log('Download failed');
    });
  }


  /** 
   * Method Name   : getDowloadURL()
   * Purpose       : to get the url of image stored in firebase storage
   * Trigger when  : invoked by any method
  **/
  public getDowloadURL(fileName){
    this.getInstanceOfStorage().child('' + fileName).getDownloadURL().then((url) => {
      this.url = url;
    }).catch((err) => console.log(err));
  }


  /** 
   * Method Name   : deleteImage()
   * Purpose       : to delete image in firebase storage
   * Trigger when  : invoked by FirebaseDatabase removeDataFromFirebase(date)
  **/
  public deleteImage(fileName) {
    this.getInstanceOfStorage().child('' + fileName).delete()
    .then(() => console.log('Delete successful'))
    .catch((error) =>console.log('Delete failed'));
  }
}
