import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CampaignService} from './data/campaign.service';
import {Campaign} from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import {Territory} from './domain/territory.model';

interface Hexagon {
  points: any[];
  centre: number[];
  borderSize: number;
  borderColor?: string;
  fill?: string;
  clickedColour?: string;
  mouseOverColour?: string;
  mouseOutColour?: string;
  clicked?: boolean;
  territory?: Territory;
  location?: number[];
}

const a = 70;

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
  hexagonList: Hexagon[] = [];
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
    {id: 12},
  ]

  height = 1000;

  h: number;
  w: number;

  constructor() {
    this.hexagon2DArray = _buildHexagonList(this.height, this.height);

    this.hexagonList = [].concat(...this.hexagon2DArray);
  }

  coordToInt(numArr) {
    return [parseInt(numArr[0].toString()), parseInt(numArr[1].toString())];
  }

  locationToCoord(location): string {
    return (location[0] + location[1] * _multiplier()).toString()
  }

  mouseOver(hexagon) {
    if (!hexagon.clicked && hexagon.mouseOverColour) {
      hexagon.fill = hexagon.mouseOverColour
    }
  }

  mouseOut(hexagon) {
    if (!hexagon.clicked && hexagon.mouseOutColour) {
      hexagon.fill = hexagon.mouseOutColour
    }
  }

  onClick(hexagon) {
    var seedCoord = hexagon.location
    if (   seedCoord[0] > 0 && seedCoord[0] < rowLength - 1 &&
      seedCoord[1] > 0 && seedCoord[1] < columnLength - 1) {

      this.hexagonList.forEach(hex => hex.fill = 'rgba(100, 100, 20, 0.2)')

      var selectedHexagonCodes = _selectHexagonsForTerritories(hexagon.location, this.territories);

      _setSelectedColours(selectedHexagonCodes, this.hexagon2DArray);
    }
  }
}

function _setSelectedColours(codeList, hexagon2DArray) {
  // codeList.map(code => _codeToCoord(code)).forEach(coord => {
  //   var hex = hexagon2DArray[coord[0]][coord[1]];
  //   hex.clickedColour = 'rgba(200, 50, 50, 0.8)';
  //   hex.mouseOverColour = 'rgba(200, 50, 50, 0.5)';
  //   hex.mouseOutColour = 'rgba(200, 50, 50, 0.2)';
  //
  //   hex.fill = hex.mouseOutColour;
  // });

  hexagon2DArray.forEach((row, x) => {
    row.forEach((hex, y) => {

      if (codeList.includes(_coordToCode([x, y]))) {
        //  selected
        hex.clickedColour = 'rgba(200, 50, 50, 0.8)';
        hex.mouseOverColour = 'rgba(200, 50, 50, 0.5)';
        hex.mouseOutColour = 'rgba(200, 50, 50, 0.2)';

        hex.fill = hex.mouseOutColour;
      } else {
        //  border
        hex.clickedColour = 'rgba(100, 100, 50, 0.8)';
        hex.mouseOverColour = 'rgba(100, 100, 50, 0.5)';
        hex.mouseOutColour = 'rgba(100, 100, 50, 0.2)';

        hex.fill = hex.mouseOutColour;
      }

    });
  });
}

function _selectHexagonsForTerritories(seedCoord, territories) {
  var selectedHexagonCodes: number[] = [_coordToCode(seedCoord)];
  var selectableOptions: number[] = _getNewOptions(_coordToCode(seedCoord), selectedHexagonCodes);

  while (selectedHexagonCodes.length < territories.length &&
  selectedHexagonCodes.length < (columnLength * rowLength) - ((columnLength - 1) * 2) + ((rowLength - 1) * 2)) {

    var hexagonIndexCode: number = selectableOptions[getRandomArbitrary(1, selectableOptions.length - 1)];

    if (!selectedHexagonCodes.includes(hexagonIndexCode)) {

      selectedHexagonCodes.push(hexagonIndexCode);

      selectableOptions = selectableOptions.filter(code => code !== hexagonIndexCode);

      selectableOptions.push(...[].concat(...selectedHexagonCodes.map(code => _getNewOptions(code, selectedHexagonCodes))));

      // more spikey...
      // selectableOptions.push(..._getNewOptions(hexagonIndexCode, selectedHexagonCodes));

    }
  }

  return selectedHexagonCodes;
}

function _getNewOptions(hexagonIndexCode, selectedHexagonCodes): number[] {
  var allowedCoords = _generateSurroundingHexagonCodes(_codeToCoord(hexagonIndexCode)).filter(coord =>
    coord[0] > 0 && coord[0] < rowLength - 1 &&
    coord[1] > 0 && coord[1] < columnLength - 1
  )

  var codes = allowedCoords.map(coord => _coordToCode(coord));

  return codes.filter(code => !selectedHexagonCodes.includes(code));
}

function _generateSurroundingHexagonCodes(coord: number[]) {
  const evenOddAdjust = (coord[0] % 2 == 0) ? -1 : 1;

  return [
    [coord[0], coord[1] + 1],
    [coord[0], coord[1] - 1],
    [coord[0] - 1, coord[1]],
    [coord[0] + 1, coord[1]],
    [coord[0] - 1, coord[1] + evenOddAdjust],
    [coord[0] + 1, coord[1] + evenOddAdjust],
  ]
}

function _buildHexagonList(width, height) {
  var alternate = false;
  var hexagonList = [];

  for (let x = a * 2; x <= (width - a * 2); x += a * 1.5) {
    var hexagonRow = []
    for (let y = a * 2; y <= (height - a * 2); y += h) {
      var hex: Hexagon = _buildHexagon(x, alternate ? y + h / 2 : y)
      hex.location = [hexagonList.length, hexagonRow.length]
      hexagonRow.push(hex);
    }
    alternate = !alternate
    hexagonList.push(hexagonRow);
  }

  rowLength = hexagonList.length;
  columnLength = hexagonList[0].length;
  return hexagonList;
}

function _buildHexagon(x, y) {
  return {
    points: _calcHexagonCoOrds(x, y),
    centre: [x, y],
    borderSize: 2,
    borderColor: 'rgba(125, 125, 32, 0.8)',
    clickedColour: 'rgba(100, 100, 20, 0.8)',
    mouseOverColour: 'rgba(100, 100, 20, 0.5)',
    mouseOutColour: 'rgba(100, 100, 20, 0.2)',
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

function _codeToCoord(hexagonIndexCode: number) {
  return [hexagonIndexCode % _multiplier(), parseInt((hexagonIndexCode / _multiplier()).toString())]
}

function _coordToCode(hexagonCoord: number[]) {
  return hexagonCoord[0] + hexagonCoord[1] * _multiplier();
}

function _multiplier() {
  return rowLength > columnLength ? rowLength : columnLength;
}
