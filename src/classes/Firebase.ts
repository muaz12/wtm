
//REQUIRED LIBRARY AND DEPENDENCIES
declare var firebase: any;

//CLASS
export class FirebaseProvider {

  //VARIABLE
  static firebaseObject: FirebaseProvider;
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
  public pushDataToFirebase(user, ntu, latitude, longitude, date, url) {
    this.getInstanceOfResult().push({
      user: ''+user, 
      ntu: ntu, 
      latitude: latitude, 
      longitude: longitude, 
      date: date, 
      url: ''+url
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
  }


  public getData() {
    this.log = this.log + ', user: ' + this.data.user + ', ntu: ' + this.data.ntu + ', lat: ' + this.data.latitude + ', long: ' + this.data.longitude + ', date: ' + this.data.date + ', url: ' + this.data.url;
    return this.log; 
  }
}
