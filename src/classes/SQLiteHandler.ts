
//REQUIRED DEPENDENCIES AND LIBRARIES
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DirectoryHandler } from './DirectoryHandler';
import { LocationHandler } from './LocationHandler';
import { Dates } from './Dates';
import { User } from './User';


//CLASS
export class SQLiteHandler {
  
  //VARIABLE
  static sqliteObject: SQLiteHandler;
  directoryObject = DirectoryHandler.getInstance();
  locationObject = LocationHandler.getInstance();
  datesObject = Dates.getInstance();
  userObject = User.getInstance();
  dataArray = [];
  log: string = '';

  public getLog() {
    return this.log;
  }

   
  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of DatabaseHandler class
   * Trigger when  : invoked by ProcessPage 
   **/
  public static getInstance() {
    if(!this.sqliteObject){
      this.sqliteObject = new SQLiteHandler();
    }
    return this.sqliteObject;
  }


  /** 
   * Method Name   : getSQLite()
   * Purpose       : to get the instance of SQLite class
   * Trigger when  : invoked by openDatabase() 
   **/
  public getSQLite() {
    return new SQLite();
  }


  /** 
   * Method Name   : openDatabase()
   * Purpose       : to open database named "WTMDatabase.db"
   * Trigger when  : invoked by CRUD functions
   **/
  public openDatabase() {
    return this.getSQLite().create({name: 'WTMDatabase.db', location: 'default'});
  }


  /** 
   * Method Name   : createTableResult()
   * Purpose       : to create table "result" in Application database
   * Trigger when  : invoked by 
   **/
  public createTableResult() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'CREATE TABLE IF NOT EXISTS result(user VARCHAR(32), ntu DOUBLE(20,10), latitude DOUBLE(20,10), longitude DOUBLE(20,10), date DOUBLE(20,0), url VARCHAR(32))';
      db.executeSql(sqlStatement, {}).then(() => console.log('Executed sql create statement for result'))
      .catch(e => console.log(e));
     }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : createTableUser()
   * Purpose       : to create table "user" in Application database
   * Trigger when  : invoked by 
   **/
  public createTableUser() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'CREATE TABLE IF NOT EXISTS user(username VARCHAR(32), password VARCHAR(32))';
      db.executeSql(sqlStatement, {}).then(() => console.log('Executed sql create statement for user'))
      .catch(e => console.log(e));
     }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : dropTableResult()
   * Purpose       : to drop table "result" in Application database
   * Trigger when  : invoked by 
   **/
  public dropTableResult() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'DROP TABLE result';
      db.executeSql(sqlStatement, {}).then(() => console.log('Executed sql drop statement'))
      .catch(e => console.log(e));
     }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : dropTableUser()
   * Purpose       : to drop table "user" in Application database
   * Trigger when  : invoked by 
   **/
  public dropTableUser() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'DROP TABLE user';
      db.executeSql(sqlStatement, {}).then(() => console.log('Executed sql drop statement'))
      .catch(e => console.log(e));
     }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : readDataResult()
   * Purpose       : to read all data inside table "result"
   * Trigger when  : invoked by 
   **/
  public readDataResult() {
    this.openDatabase().then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM result', {}).then((data) => {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            //this.log = this.log + 'Log: ' + data.rows.item(i).user + ',' + data.rows.item(i).ntu + ',' + data.rows.item(i).latitude + ',' + data.rows.item(i).longitude + ',' + data.rows.item(i).date + ',' + data.rows.item(i).url;
            this.dataArray.push({ user: data.rows.item(i).user, ntu: data.rows.item(i).ntu, latitude: data.rows.item(i).latitude, longitude: data.rows.item(i).longitude, date: data.rows.item(i).date, url: data.rows.item(i).url});
          }
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    return this.dataArray;
  }

  /** 
   * Method Name   : readDataResult()
   * Purpose       : to read all data inside table "result"
   * Trigger when  : invoked by 
   **/
  public readLatLong() {
   let data = this.readDataResult();
   let latitudeArray = [];
   let longitudeArray = [];
   for (var i = 0; i < data.length; i++) {
    latitudeArray.push();
   }
  }


  /** 
   * Method Name   : readDataUser()
   * Purpose       : to read all user's data inside table "user"
   * Trigger when  : invoked by 
   **/
  public readDataUser() {
    var data = [];
    this.openDatabase().then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM user', {}).then((data) => {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
             data.push({ username: data.rows.item(i).username, password: data.rows.item(i).password});
          }
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    return data;
  }


  /** 
   * Method Name   : readDataSpecificUser(user)
   * Purpose       : to read specific user's data inside table "user"
   * Trigger when  : invoked by 
   **/
  public readDataSpecificUser(user) {
    var data = [];
    this.openDatabase().then((db: SQLiteObject) => {
      db.executeSql('SELECT username, password FROM user WHERE username = "'+user+'"', {}).then((data) => {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
             data.push({ username: data.rows.item(i).username, password: data.rows.item(i).password});
          }
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    return data;
  }


  /** 
   * Method Name   : insertData(ntu)
   * Purpose       : to store NTU result inside table "result"
   * Trigger when  : invoked by 
   **/
  public insertDataResult(ntu) {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'INSERT INTO result VALUES("'+this.userObject.getUserName()+'", '+ntu+', '+this.locationObject.latitude+', '+this.locationObject.longitude+', '+this.datesObject.date+', "'+this.directoryObject.pathForImage()+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  public insertDummyData() {
    
    this.openDatabase().then((db: SQLiteObject) => {
      
      //dummy data 1
      var path = this.directoryObject.getPath() + this.datesObject.getDates() + '.jpg';
      var sqlStatement = 'INSERT INTO result VALUES("Muaz", 53.6590, 2.929668902484878, 101.68611109256744, '+this.datesObject.date+', "'+path+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));

      //dummy data 2
      var path = this.directoryObject.getPath() + this.datesObject.getDates() + '.jpg';
      var sqlStatement = 'INSERT INTO result VALUES("Syazani", 6.6577, 2.895209533261299, 101.72130167484283, '+this.datesObject.date+', "'+path+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));

      //dummy data 3
      var path = this.directoryObject.getPath() + this.datesObject.getDates() + '.jpg';
      var sqlStatement = 'INSERT INTO result VALUES("Syahmi", 23.2025, 2.8662354211137324, 101.63014948368073, '+this.datesObject.date+', "'+path+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));

      //dummy data 4
      var path = this.directoryObject.getPath() + this.datesObject.getDates() + '.jpg';
      var sqlStatement = 'INSERT INTO result VALUES("Muaz", 16.6378, 2.8574916097011016, 101.5027767419815, '+this.datesObject.date+', "'+path+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));

      //dummy data 5
      var path = this.directoryObject.getPath() + this.datesObject.getDates() + '.jpg';
      var sqlStatement = 'INSERT INTO result VALUES("Syazani", 13.2774, 2.8038271591181347, 101.41265451908112, '+this.datesObject.date+', "'+path+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));

      //dummy data 6
      var path = this.directoryObject.getPath() + this.datesObject.getDates() + '.jpg';
      var sqlStatement = 'INSERT INTO result VALUES("Syahmi", 38.6206, 2.8123999214928697, 101.51015818119049, '+this.datesObject.date+', "'+path+'")';
      db.executeSql(sqlStatement, {})
      .then(() => console.log('Data result inserted'))
      .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  /** 
   * Method Name   : insertDataUser()
   * Purpose       : to store user's data inside table "user"
   * Trigger when  : invoked by 
   **/
  public insertDataUser(username, password) {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'INSERT INTO user VALUES("'+username+'", "'+password+'")';
      db.executeSql(sqlStatement, {})
        .then(() => console.log('Data user inserted'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : updateNTU(value)
   * Purpose       : to update data inside table "result"
   * Trigger when  : invoked by 
   **/
  public updateNTU(value) {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'UPDATE result SET ntu = '+value+' WHERE latitude = 123.432';
      db.executeSql(sqlStatement, {})
        .then(() => console.log('Executed sql update statement for result'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : updateUser(value)
   * Purpose       : to update data inside table "result"
   * Trigger when  : invoked by 
   **/
  public updateUser(username, password) {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'UPDATE user SET password = "'+password+'" WHERE username = "'+username+'"';
      db.executeSql(sqlStatement, {})
        .then(() => console.log('Executed sql update statement for user'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : deleteDataResult()
   * Purpose       : to delete data inside table "result"
   * Trigger when  : invoked by 
   **/
  public deleteDataResult() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'DELETE FROM result';
      db.executeSql(sqlStatement, {})
        .then(() => console.log('Executed sql delete statement for result'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : deleteDataUser()
   * Purpose       : to delete data inside table "user"
   * Trigger when  : invoked by 
   **/
  public deleteDataUser(username) {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'DELETE FROM user WHERE username = "'+username+'"';
      db.executeSql(sqlStatement, {})
        .then(() => console.log('Executed sql delete statement for user'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
}