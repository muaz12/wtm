
//REQUIRED DEPENDENCIES AND LIBRARIES
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LocationHandler } from './LocationHandler';
import { Dates } from './Dates';
import { Path } from './Path';


//CLASS
export class DatabaseHandler {
  
  //VARIABLE
  static databaseObject: DatabaseHandler;
  locationObject = LocationHandler.getInstance();
  datesObject = Dates.getInstance();
  pathObject = Path.getInstance();
  log = '';

  
  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of DatabaseHandler class
   * Trigger when  : invoked by ProcessPage 
   **/
  public static getInstance() {
    if(!this.databaseObject){
      this.databaseObject = new DatabaseHandler();
    }
    return this.databaseObject;
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
   * Trigger when  : invoked by createTable(), dropTable(), readData(), insertData(ntu), updateNTU(value),
   *                 deleteData()
   **/
  public openDatabase() {
    this.log = this.log + 'passed openDatabase';
    return this.getSQLite().create({name: 'WTMDatabase.db', location: 'default'});
  }


  /** 
   * Method Name   : createTable()
   * Purpose       : to create table "result" in Application database
   * Trigger when  : invoked by 
   **/
  public createTable() {
    this.openDatabase().then((db: SQLiteObject) => {
      this.log = this.log + 'passed createTable';
      var sqlStatement = 'CREATE TABLE IF NOT EXISTS result(user VARCHAR(32), ntu DOUBLE(20,10), latitude DOUBLE(20,10), longitude DOUBLE(20,10), date DOUBLE(20,0), url VARCHAR(32))';
      db.executeSql(sqlStatement, {}).then(() => {
        this.log = this.log + 'passed Executed sql create statement';
        console.log('Executed sql create statement');
      })
      .catch(e => console.log(e));
     }).catch(e => console.log(e));
  }

  public getLog() {
    return this.log;
  }


  /** 
   * Method Name   : dropTable()
   * Purpose       : to drop table "result" in Application database
   * Trigger when  : invoked by 
   **/
  public dropTable() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'DROP TABLE result';
      db.executeSql(sqlStatement, {}).then(() => console.log('Executed sql drop statement'))
      .catch(e => console.log(e));
     }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : readData()
   * Purpose       : to read the data inside table "result"
   * Trigger when  : invoked by 
   **/
  public readData() {
    var data = [];
    this.openDatabase().then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM result', {}).then((data) => {
        console.log('Executed sql statement read');
        if (data.rows.length > 0) {
          this.log = this.log + 'passed Executed sql select statement';
          for (var i = 0; i < data.rows.length; i++) {
            this.log = this.log +  data.rows.item(i).user + ', ' + data.rows.item(i).ntu + ', ' + data.rows.item(i).latitude + ', ' + data.rows.item(i).longitude + ', ' + data.rows.item(i).date + ', ' + data.rows.item(i).url;
            /*data.push({ user: data.rows.item(i).user, ntu: data.rows.item(i).ntu, lat: data.rows.item(i).latitude,
                        long: data.rows.item(i).longitude, date: data.rows.item(i).date, 
                        url: data.rows.item(i).url 
            });*/
          }
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    
    //return data;
  }


  /** 
   * Method Name   : insertData(ntu)
   * Purpose       : to store NTU result inside table "result"
   * Trigger when  : invoked by 
   **/
  public insertData(ntu) {
    var user = 'Syazani';
    
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'INSERT INTO result VALUES("'+user+'", '+ntu+', '+this.locationObject.getLatitude()+', '+this.locationObject.getLongitude()+', '+this.datesObject.date+', "'+this.pathObject.pathForImage()+'")';
      db.executeSql(sqlStatement, {})
        .then(() => {
          this.log = this.log + 'passed Executed sql insert statement';
          console.log('Executed sql insert statement');
        })
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
        .then(() => {
          console.log('Executed sql update statement');
          this.log = this.log + 'passed Executed sql update statement';
        })
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }


  /** 
   * Method Name   : deleteData()
   * Purpose       : to delete data inside table "result"
   * Trigger when  : invoked by 
   **/
  public deleteData() {
    this.openDatabase().then((db: SQLiteObject) => {
      var sqlStatement = 'DELETE FROM result WHERE latitude = 123.432';
      db.executeSql(sqlStatement, {})
        .then(() => {
          console.log('Executed sql delete statement');
          this.log = this.log + 'passed Executed sql delete statement';
        })
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
}