import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  myVariable: string = 'The force is with me!';
  greyscaleStr;
  imgwidth;
  imgheight;

  updateMyValue(){
    this.myVariable= 'Now the Force is Even Stronger!';
  }
  opencamera(){
    var c = <HTMLCanvasElement>document.getElementById("myCanvas");
    // var c = <HTMLCanvasElement>document.createElement('virCanvas');
    var ctx = <CanvasRenderingContext2D> c.getContext("2d");    
    var img = <HTMLImageElement>document.getElementById("ntu");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled =false;
    var height = img.height;
    var width = img.width;
    c.width = width;
    c.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    this.imgheight= height;
    this.imgwidth = width;

    var imgData = ctx.getImageData(0, 0, img.width, img.height); //0,0 start read at what position,
    this.greyscaleStr =  imgData.data.length;
    
    
    // Greyscale Algo (just to show)
    var i;
    for (i = 0; i < imgData.data.length; i += 4) {
      var avg = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) /3;
        imgData.data[i] = avg;
        imgData.data[i+1] = avg;
        imgData.data[i+2] = avg;
    }

    // Mean Greyscale Intensity Algo
    var j, k; //the loop
    var counter = 0; //the array coordinate
    var greyPix;// this is the formula of changing each and every pixel of image to greyscale
    var meanWidth = [];//used for the gmi
    var totalHeight = 0;//to count total of pixel in a height in array
    //mean all pixel in the rows
    for (j = 0; j < height; j++) {
      var totalWidth = 0;//to count total of pixel in a row in array
      for ( k = 0; k < (width*4); k+= 4) {
        greyPix= (imgData.data[counter] + imgData.data[counter+1] + imgData.data[counter+2])/3;
        // greyPix= (imgData.data[counter]*0.3 + imgData.data[counter+1]*0.59 + imgData.data[counter+2]*0.11);
        // greyPix= (imgData.data[counter]*0.2126  + imgData.data[counter+1]*0.7152  + imgData.data[counter+2]*0.0722);
        // greyPix= (imgData.data[counter]*0.299  + imgData.data[counter+1]*0.587  + imgData.data[counter+2]*0.114);
        totalWidth = totalWidth + greyPix;
        
        /* if (k==((width*4)-4)){
          imgData.data[counter] = 255;
          console.log('counter = ' + counter + ' row = ' + j);
        }  */       //to test the loop whether or not it is working

        counter+=4;
        // console.log('each pixel = '+greyPix);
      }
      // console.log('total pixel for that row = ' +totalWidth);
      meanWidth [j]= totalWidth/width;
      // console.log('the mean for that row = '+ meanWidth [j]);
      totalHeight = totalHeight + meanWidth[j];
      // console.log('cummulative height = ' + totalHeight);
    }
    //greyscale (mean all the height using the meaned row)
    var gmi =  totalHeight/height;
    console.log('gmi = '+gmi);
    var ntu = 3.80*(gmi)+5.35;
    console.log('the turbidity is = '+ntu);
    ctx.putImageData(imgData, 0, 0); //0,0 is the position
  }
}
