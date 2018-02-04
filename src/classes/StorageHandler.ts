
//REQUIRED DEPENDENCIES AND LIBRARIES
import { FirebaseDatabase } from './FirebaseDatabase';
import { SQLiteHandler } from './SQLiteHandler';


//CLASS
export class StorageHandler {
  
  //VARIABLE
  static storageObject: StorageHandler;
  sqliteObject = SQLiteHandler.getInstance();
  firebaseDatabaseObject = FirebaseDatabase.getInstance();


  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of StorageHandler class
   * Trigger when  : invoked by  
   **/
  public static getInstance() {
    if(!this.storageObject){
      this.storageObject = new StorageHandler();
    }
    return this.storageObject;
  }


  /** 
   * Method Name   : checkDataExistence()
   * Purpose       : to check the data stored in Firebase Database and SQLite Database. 
   * Trigger when  : invoked by  
   **/
  public checkDataExistence() {

  }


  /** 
   * Method Name   : updateDataFirebase()
   * Purpose       : to update data stored in Firebase Database. 
   * Trigger when  : invoked by  
   **/
  public updateDataFirebase() {

  }


  /** 
   * Method Name   : updateDataSQLite()
   * Purpose       : to update data stored in SQLite Database. 
   * Trigger when  : invoked by  
   **/
  public updateDataSQLite() {

  }
}