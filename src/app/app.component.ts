import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CampaignService} from './data/campaign.service';
import {Campaign} from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import {Territory} from './domain/territory.model';
import {NgxSvgModule} from 'ngx-svg';

interface Polygon {
  points: any[];
  centre: number[];
  borderSize: number;
  borderColor?: string;
  fill?: string;
  clicked?: boolean;
  territory?: Territory;
}

const a = 50;

// width
// var w = a * 2;

// height
const h = Math.sqrt(3) * a;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'Necromunda Campaign Tracker';

  hexagon2DArray: any[] = [];
  hexagonList: Polygon[] = [];
  territories = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
    {id: 9},
    {id: 10},
    {id: 11},
    {id: 12}
  ]
  h: number;
  w: number;

  constructor() {
    var width = 1000;
    var height = 1000;

    this.hexagon2DArray = _buildHexagonList(width, height);
    this.hexagonList = [].concat(...this.hexagon2DArray);

    _selectHexagonsForTerritories(this.territories, this.hexagon2DArray, width, height,);
  }

  mouseOver(hexagon) {
    if (!hexagon.clicked) {
      hexagon.fill = 'rgba(100, 100, 20, 0.5)'
    }
  }

  mouseOut(hexagon) {
    if (!hexagon.clicked) {
      hexagon.fill = 'rgba(100, 100, 20, 0.2)'
    }
  }

  onClick(hexagon) {
    if (hexagon.clicked) {
      hexagon.fill = 'rgba(100, 100, 20, 0.5)'
    } else {
      hexagon.fill = 'rgba(200, 50, 50, 0.2)'
    }
    hexagon.clicked = !hexagon.clicked
  }
}


function _selectHexagonsForTerritories(territories, hexagon2DArray, width, height) {
  var selectedHexagonIndexes = [];
  while (selectedHexagonIndexes.length < territories.length) {
    let hexagonIndex = [getRandomArbitrary(0, hexagon2DArray.length - 1), getRandomArbitrary(0, hexagon2DArray[0].length - 1)];
    let tempHexagon = hexagon2DArray[hexagonIndex[0]][hexagonIndex[1]];

    if (tempHexagon.centre[0] > a * 3 &&
      tempHexagon.centre[0] < width - a * 3 &&
      tempHexagon.centre[1] > a * 3 &&
      tempHexagon.centre[1] < height - a * 3 &&
      !selectedHexagonIndexes.includes(hexagonIndex) &&
      hexagonIndex) {


      selectedHexagonIndexes.push(hexagonIndex);
      tempHexagon.fill = 'rgba(50, 50, 200, 0.5)'

    }
  }
}

function _buildHexagonList(width, height) {
  var alternate = false;
  var hexagonList = [];

  for (let x = a * 2; x <= (width - a * 2); x += a * 1.5) {
    var hexagonRow = []
    for (let y = a * 2; y <= (height - a * 2); y += h) {
      hexagonRow.push(_buildHexagon(x, alternate ? y + h / 2 : y));
    }
    alternate = !alternate
    hexagonList.push(hexagonRow);
  }

  return hexagonList;
}

function _buildHexagon(x, y) {
  return {
    points: _calcHexagonCoOrds(x, y),
    centre: [x, y],
    borderSize: 2,
    borderColor: 'rgba(125, 125, 32, 0.8)',
    fill: 'rgba(100, 100, 20, 0.2)'
  }
}

// given an x,y location this builds the points for <polygon>
function _calcHexagonCoOrds(x: number, y: number) {
  return Array.from(Array(6).keys()).map(i => [
    x + a * Math.cos(2 * Math.PI * i / 6),
    y + a * Math.sin(2 * Math.PI * i / 6)
  ]);
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


// -   -
// - = -
//   -
