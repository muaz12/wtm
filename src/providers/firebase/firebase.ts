
//REQUIRED LIBRARY AND DEPENDENCIES
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
declare var firebase: any;

//CLASS
@Injectable()
export class FirebaseProvider {

  //VARIABLE
  private wtm$: any;
  private database: any;
  private WTMReference: any;

  //CONSTRUCTOR
  constructor() {
    this.database = firebase.database().ref('/'); // Get a firebase reference to the root 
    this.WTMReference = firebase.database().ref('wtm'); // Get a firebase reference to the wtm
    this.WTMReference.on('child_added', this.handleData, this);
    this.wtm$ = new ReplaySubject();
  }


  public get todos() {
    return this.wtm$;
  }


  public handleData(snap) { 
    try { 
      // Tell our observer we have new data 
      this.wtm$.next(snap.val()); 
    } catch (error) { 
      console.log('catching', error);
    }
  }


  public saveData(user, ntu, latitude, longitude, date, url) {
    return this.WTMReference.push(user, ntu, latitude, longitude, date, url).key;
  }
}
