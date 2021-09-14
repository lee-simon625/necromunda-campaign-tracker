import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CampaignService} from './data/campaign.service';
import {Campaign} from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import {Territory} from './domain/territory.model';
import {NgxSvgModule} from 'ngx-svg';

interface Polygon {
  points: any[];
  borderSize: number;
  borderColor?: string;
  fill?: string;
}

var a = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'Necromunda Campaign Tracker';

  // @ViewChild('canvas') canvas: ElementRef;
  // ctx: CanvasRenderingContext2D | null;

  // a = (2 * Math.PI) / 6;


  hexagonList: Polygon[] = [];

  // the height of a hexagon
  // h = √3 * a

  // the width of a hexagon
  // w = a * 2

  h: number;
  w: number;

  constructor() {
    this.h = Math.sqrt(3) * a;
    this.w = a * 2;

    // for (let x = 20; x < 100;) {
    var x = 100;

    var alternate = false;

      for (let y = 100; y < 1000; y+=this.h/2) {

        this.hexagonList.push(_buildHexagon(
          alternate? x+this.w*0.75 : x,
          y
        ));

        alternate = !alternate

      }

      // x += this.w;
    // }

  }

  mouseOver(hexagon) {
    hexagon.fill = 'rgba(100, 100, 20, 0.5)'
  }

  mouseOut(hexagon) {
    hexagon.fill = 'rgba(100, 100, 20, 0.2)'
  }
}

function _buildHexagon(x, y) {
  return {
    points: _calcHexagonCoOrds(x, y),
    borderSize: 2,
    borderColor: 'rgba(125, 125, 32, 0.8)',
    fill: 'rgba(100, 100, 20, 0.2)'
  }
}

// given an x,y location this builds the points for <polygon>
function _calcHexagonCoOrds(x: number, y: number) {
  var hexagonCoOrds = [];

  for (let i = 0; i < 6; i++) {
    hexagonCoOrds.push([
      x + a * Math.cos(2 * Math.PI * i / 6),
      y + a * Math.sin(2 * Math.PI * i / 6)
    ]);
  }

  return hexagonCoOrds;
}

//
//   ngAfterViewInit() {
//     this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
//
//     this.drawGrid(
//       this.canvas.nativeElement.width,
//       this.canvas.nativeElement.height
//     );
//   }
//
//   drawGrid(width: number, height: number) {
//     for (
//       let y = this.r;
//       y + this.r * Math.sin(this.a) < height;
//       y += this.r * Math.sin(this.a)
//     ) {
//       for (
//         let x = this.r, j = 0;
//         x + this.r * (1 + Math.cos(this.a)) < width;
//         x += this.r * (1 + Math.cos(this.a)),
//           y += (-1) ** j++ * this.r * Math.sin(this.a)
//       ) {
//         this.drawHexagon(x, y);
//       }
//     }
//   }
//   drawHexagon(x: number, y: number) {
//     var newHexagon = {};
//
//     this.ctx?.beginPath();
//     for (let i = 0; i < 6; i++) {
//       this.ctx?.lineTo(
//         x + this.r * Math.cos(this.a * i),
//         y + this.r * Math.sin(this.a * i)
//       );
//     }
//
//     this.hexagonList.push(newHexagon)
//     this.ctx?.closePath();
//     this.ctx?.stroke();
//   }
// }
