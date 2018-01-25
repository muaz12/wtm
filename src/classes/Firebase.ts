
//REQUIRED LIBRARY AND DEPENDENCIES
import { LocationHandler } from './LocationHandler';
import { Dates } from './Dates';
import { User } from './User';
import { Path } from './Path';
declare var firebase: any;

//CLASS
export class FirebaseProvider {

  //VARIABLE
  static firebaseObject: FirebaseProvider;
  locationObject = LocationHandler.getInstance();
  datesObject = Dates.getInstance();
  userObject = User.getInstance();
  pathObject = Path.getInstance();
  data;
  log;

 
  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of FirebaseProvider class
   * Trigger when  : invoked by 
   **/
  public static getInstance() {
    if(!this.firebaseObject){
      this.firebaseObject = new FirebaseProvider();
    }
    return this.firebaseObject;
  }

  /** 
   * Method Name   : getInstanceOfDatabase()()
   * Purpose       : to get a firebase reference to the database (root) in firebase
   * Trigger when  : invoked by 
  **/
  public getInstanceOfDatabase() {
    return firebase.database().ref();
  }


  /** 
   * Method Name   : getInstanceOfResult()
   * Purpose       : to get a firebase reference to the "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public getInstanceOfResult() {
    this.log = this.log + ', Result ref got ,';
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
    this.getInstanceOfResult().push({
      user: ''+this.userObject.getUserName(), 
      ntu: ntu, 
      latitude: this.locationObject.latitude, 
      longitude: this.locationObject.longitude, 
      date: this.datesObject.date, 
      url: ''+this.pathObject.pathForImage()
    });
    this.log = this.log + ', Data inserted ,';
  }


  /** 
   * Method Name   : pullDataFromFirebase()
   * Purpose       : to read the data from "result" table in firebase
   * Trigger when  : invoked by 
  **/
  public pullDataFromFirebase() { 
    this.getInstanceOfResult().on('child_added', function(snapshot) {
      this.data = snapshot.val(); 
    });
    this.log = this.log + ', Data read ,';
    this.log = this.log + ', user: ' + this.data.user + ', ntu: ' + this.data.ntu + ', lat: ' + this.data.latitude + ', long: ' + this.data.longitude + ', date: ' + this.data.date + ', url: ' + this.data.url;
    
  }
}
