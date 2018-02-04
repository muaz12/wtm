
//REQUIRED LIBRARY AND DEPENDENCIES
import { FirebaseStorage } from './FirebaseStorage';
import { LocationHandler } from './LocationHandler';
import { Dates } from './Dates';
import { User } from './User';
import { DirectoryHandler } from './DirectoryHandler';
declare var firebase: any;

//CLASS
export class FirebaseDatabase {

  //VARIABLE
  static firebaseObject: FirebaseDatabase;
  firebaseStorageObject = FirebaseStorage.getInstance();
  directoryObject = DirectoryHandler.getInstance();
  locationObject = LocationHandler.getInstance();
  datesObject = Dates.getInstance();
  userObject = User.getInstance();
  log;

  
  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of FirebaseProvider class
   * Trigger when  : invoked by 
   **/
  public static getInstance() {
    if(!this.firebaseObject){
      this.firebaseObject = new FirebaseDatabase();
    }
    return this.firebaseObject;
  }


  /** 
   * Method Name   : getInstanceOfResult()
   * Purpose       : to get a firebase reference to the "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public getInstanceOfResult() {
    return firebase.database().ref('result');
  }


  /** 
   * Method Name   : getInstanceOfUser()
   * Purpose       : to get a firebase reference to the "user" table in firebase
   * Trigger when  : invoked by 
  **/
  public getInstanceOfUser() {
    return firebase.database().ref('user');
  }


  /** 
   * Method Name   : pushDataToFirebase()
   * Purpose       : to store the result into "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public pushDataToFirebase(ntu) {
    this.getInstanceOfResult().child(this.datesObject.date)
    .set({
      user: '' + this.userObject.getUserName(), 
      ntu: ntu, 
      latitude: this.locationObject.latitude, 
      longitude: this.locationObject.longitude, 
      date: this.datesObject.date, 
      url: '' + this.directoryObject.pathForImage()
    })
    .then(_ => {
      var fileName = this.datesObject.date + '.jpg';
      this.firebaseStorageObject.uploadImage(fileName);
    })
    .catch(err => console.log(err));
  }


  /** 
   * Method Name   : pullDataFromFirebase()
   * Purpose       : to read the data from "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public pullDataFromFirebase() { 
    this.log = this.log + ', Entering pullDataFromFirebase() ,';

    var db = firebase.database();
    db.ref('result').once('value').then(function(snap) {
       var log = log + ', Entering ref ,';
        if(snap.val()){
           log = log + ', data ,' + snap.val();
           return log;
        } else {
            log = log + ', data empty ,';
            return log;
        }
    }, function(error) {
        var error2 = JSON.stringify(error);
        this.log = this.log + ', error pull: ' + error2;
    });

    /*
    firebase.database().ref('result').once("value", function(snapshot) {
      this.log = this.log + ', Entering once() ,';
      snapshot.forEach(function(childSnapshot) {
        this.log = this.log + ', Entering forEach() ,';
        //var childKey = childSnapshot.key;
        //var data = childSnapshot.val();
        //this.log = this.log + ', Data is not empty ,';
        //this.log = this.log + ', Data read ,';
       // this.log = this.log + ', user: ' + data.user + ', ntu: ' + data.ntu + ', lat: ' + data.latitude + ', long: ' + data.longitude + ', date: ' + data.date + ', url: ' + data.url;
      }).catch(e => {
        var error = JSON.stringify(e);
        this.log = this.log + ', error pull kecik: ' + error;
      });
    }).catch(e => {
        var error = JSON.stringify(e);
        this.log = this.log + ', error pull besar: ' + error;
      });*/
  }


  /** 
   * Method Name   : updateDataInFirebase(date, ntu)
   * Purpose       : to update ntu result in "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public updateDataInFirebase(date, ntu) {
    firebase.database().ref('result/' + date).update({ ntu: ntu })
    .then(function() { console.log('Data updated'); })
    .catch(function(error) { console.log(error); });
  }


  /** 
   * Method Name   : removeDataFromFirebase(date)
   * Purpose       : to delete result from "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public removeDataFromFirebase(date) {
    firebase.database().ref('result/' + date).remove()
    .then(function() { 
      var fileName = date + '.jpg';
      this.firebaseStorageObject.deleteImage(fileName);
      console.log('Data removed'); 
    }).catch(function(error) { console.log(error); });
  }
}
