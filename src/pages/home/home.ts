import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public photos : any;
  public base64Image : string;
  constructor(public navCtrl: NavController,private camera : Camera) {
  }
  ngOnInit() {
    this.photos = [];
  }
  takePhoto(){
    const options : CameraOptions = {
      quality: 50, // picture quality
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options) .then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }

  openGallery(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
     }).then((imageData) => {
       this.base64Image = 'data:image/jpeg;base64,'+imageData;
      }, (err) => {
       console.log(err);
     });
   }
}
