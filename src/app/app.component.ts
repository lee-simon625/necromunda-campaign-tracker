import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CampaignService} from './data/campaign.service';
import {Campaign} from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import {Territory} from './domain/territory.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  // title = 'Necromunda Campaign Tracker';

  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D | null;

  a = (2 * Math.PI) / 6;
  r = 50;

  hexagonList = [];

  constructor() {

  }

  ngAfterViewInit() {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');

    this.drawGrid(
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  drawGrid(width: number, height: number) {
    for (
      let y = this.r;
      y + this.r * Math.sin(this.a) < height;
      y += this.r * Math.sin(this.a)
    ) {
      for (
        let x = this.r, j = 0;
        x + this.r * (1 + Math.cos(this.a)) < width;
        x += this.r * (1 + Math.cos(this.a)),
          y += (-1) ** j++ * this.r * Math.sin(this.a)
      ) {
        this.drawHexagon(x, y);
      }
    }
  }

  drawHexagon(x: number, y: number) {
    var newHexagon = {};

    this.ctx?.beginPath();
    for (let i = 0; i < 6; i++) {
      this.ctx?.lineTo(
        x + this.r * Math.cos(this.a * i),
        y + this.r * Math.sin(this.a * i)
      );
    }

    this.hexagonList.push(newHexagon)
    this.ctx?.closePath();
    this.ctx?.stroke();
  }
}
