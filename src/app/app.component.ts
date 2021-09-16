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

var rowLength: number;
var columnLength: number;

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

  height = 800;

  h: number;
  w: number;

  constructor() {

    this.hexagon2DArray = _buildHexagonList(this.height, this.height);
    rowLength = this.hexagon2DArray.length;
    columnLength = this.hexagon2DArray[0].length;


    this.hexagonList = [].concat(...this.hexagon2DArray);

    _selectHexagonsForTerritories(
      this.territories,
      this.hexagon2DArray);
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



function _selectHexagonsForTerritories(territories, hexagon2DArray) {
  let seedIndex = [getRandomArbitrary(1, rowLength - 2), getRandomArbitrary(1, columnLength - 2)];

  var selectedHexagonIndexes = [];
  var selectableOptions = [];
  _addNewOptions(seedIndex, selectedHexagonIndexes, selectableOptions);

  while (selectedHexagonIndexes.length < territories.length &&
  selectedHexagonIndexes.length < (columnLength * rowLength) - ((columnLength - 1) * 2) + ((rowLength - 1) * 2)) {

    var hexagonIndexCode = selectableOptions[getRandomArbitrary(1, selectableOptions.length - 1)];
    var hexagonIndex = _codeToCoord(hexagonIndexCode);

    if (!selectedHexagonIndexes.includes(hexagonIndexCode)) {

      selectedHexagonIndexes.push(hexagonIndexCode);

      _removeOption(hexagonIndexCode, selectableOptions);

      _addNewOptions(hexagonIndexCode, selectedHexagonIndexes, selectableOptions);

    }
  }
}

function _codeToCoord(hexagonIndexCode: number) {
  return []
}
function _coordToCcode(hexagonCoord: number[]) {
  return 0
}

function _removeOption(hexagonIndexCode, selectableOptions) {
  var optionIndex = selectableOptions.findIndex(hexagonIndex);
  if (optionIndex) {
    selectableOptions.splice(optionIndex, 1);
  }
}

function _addNewOptions(hexagonIndexCode, selectedHexagonIndexes, selectableOptions) {

  _generateSeroundingHexagonCodes(_codeToCoord(hexagonIndexCode);
//todo
  selectableOptions.push();
}

function _generateSeroundingHexagonCodes(coord: number[]) {
  var surroundingIndexCodes = [];
  //todo
  return surroundingIndexCodes
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
