
//REQUIRED LIBRARY AND DEPENDENCIES
declare var firebase: any;

//CLASS
export class FirebaseStorage {

  //VARIABLE
  static firebaseStorageObject: FirebaseStorage;
  uploadTask;
  log: string = 'storage';

  public getLog() {
      return this.log;
  }
  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of FirebaseStorage class
   * Trigger when  : invoked by 
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
   * Trigger when  : invoked by 
  **/
  public getInstanceOfStorage() {
    this.log = this.log + ' , passed getInstanceOfStorage() , ';
    return firebase.storage().ref('Water Turbidity Meter/Images');
  }


  /** 
   * Method Name   : uploadImage()
   * Purpose       : to upload image to firebase storage
   * Trigger when  : invoked by 
  **/
  public uploadImage(file) {
    this.uploadTask = this.getInstanceOfStorage().put(file).then(function(snapshot) {
                        console.log('Uploaded image!');
                        this.log = this.log + ' , Uploaded Image , ';
                      }).catch(function(error) {
                        console.log('Upload failed');
                        this.log = this.log + ' , Upload failed , ';
                      });

    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
      
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
        this.log = this.log + ' , Upload failed , ';
        console.log('Upload failed');
  }, function() {
    var downloadURL = this.uploadTask.snapshot.downloadURL;
  });
}


  /** 
   * Method Name   : pauseUpload()
   * Purpose       : to pause the upload of image to firebase storage
   * Trigger when  : invoked by 
  **/
  public pauseUpload() {
    this.uploadTask.pause();
  }


  /** 
   * Method Name   : resumeUpload()
   * Purpose       : to resume the upload of image to firebase storage
   * Trigger when  : invoked by 
  **/
  public resumeUpload() {
    this.uploadTask.resume();
  }


  /** 
   * Method Name   : cancelUpload()
   * Purpose       : to cancel the upload of image to firebase storage
   * Trigger when  : invoked by 
  **/
  public cancelUpload() {
    this.uploadTask.cancel();
  }


  /** 
   * Method Name   : dowloadImage()
   * Purpose       : to download image from firebase storage
   * Trigger when  : invoked by 
  **/
  public dowloadImage(fileName) {
    this.getInstanceOfStorage().child('' + fileName).getDownloadURL().then(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        this.log = this.log + ' , Dowloaded Image , ';

      }).catch(function(error) {
        this.log = this.log + ' , Dowload failed , ';
        console.log('Download failed');
      });
  }


  /** 
   * Method Name   : deleteImage()
   * Purpose       : to delete image in firebase storage
   * Trigger when  : invoked by 
  **/
  public deleteImage(fileName) {
    this.getInstanceOfStorage().child('' + fileName).delete().then(function() {
        console.log('Delete successful');
        this.log = this.log + ' , Delete Image , ';
      }).catch(function(error) {
        console.log('Delete failed');
        this.log = this.log + ' , Delete failed , ';
      });
  }



  




}
