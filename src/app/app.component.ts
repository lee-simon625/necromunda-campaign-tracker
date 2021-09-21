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
  selected?: boolean;
  territory?: Territory;
  location?: number[];
}

var a: number;
var h: number;

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
    {id: 1, gang_id: 1},
    {id: 2, gang_id: 1},
    {id: 3, gang_id: 2},
    {id: 4, gang_id: 1},
    {id: 5, gang_id: 1},
    {id: 6, gang_id: 2},
    {id: 7, gang_id: 2},
    {id: 8, gang_id: 1},
    {id: 9, gang_id: 1},
    {id: 10, gang_id: 3},
    {id: 11, gang_id: 3},
    {id: 12, gang_id: 3},
  ]

  @ViewChild('map')
  map: ElementRef;

  height = 1000;
  viewBox = [0, 0, this.height, this.height];

  constructor() {
    a = _setHexSideLength(this.territories.length);
    h = Math.sqrt(3) * a;

    this.hexagon2DArray = _buildHexagonList(this.height, this.height);

    this.hexagonList = [].concat(...this.hexagon2DArray);
  }

  mouseOver(hexagon) {
    if (hexagon.selected && hexagon.mouseOverColour) {
      hexagon.fill = hexagon.mouseOverColour
    }
  }

  mouseOut(hexagon) {
    if (hexagon.selected && hexagon.mouseOutColour) {
      hexagon.fill = hexagon.mouseOutColour
    }
  }

  onClick(hexagon) {
    var seedCoord = hexagon.location
    if (seedCoord[0] > 0 && seedCoord[0] < rowLength - 1 &&
      seedCoord[1] > 0 && seedCoord[1] < columnLength - 1) {

      var selectedHexagonCodes = _selectHexagonsForTerritories(hexagon.location, this.territories);

      _setSelectedColours(selectedHexagonCodes, this.hexagon2DArray);
    }
  }
}

function _setHexSideLength(territoryCount): number {
  var decrementAccount = territoryCount > 9 ? territoryCount - 9 : 0

  return 90 - (decrementAccount * 2)
}

function _setSelectedColours(codeList, hexagon2DArray) {
  hexagon2DArray.forEach((row, x) => {
    row.forEach((hex, y) => {
      if (codeList.includes(_coordToCode([x, y]))) {
        //  selected
        hex.borderColor = 'rgba(200, 50, 50, 1)';
        hex.clickedColour = 'rgba(200, 50, 50, 0.8)';
        hex.mouseOverColour = 'rgba(200, 50, 50, 0.5)';
        hex.mouseOutColour = 'rgba(200, 50, 50, 0.2)';

        hex.fill = hex.mouseOutColour;
        hex.selected = true;

      } else {
        //  border
        hex.borderColor = 'rgba(0, 0, 0, 0)';
        hex.clickedColour = 'rgba(0, 0, 0, 0.3)';
        hex.mouseOverColour = 'rgba(0, 0, 0, 0.3)';
        hex.mouseOutColour = 'rgba(0, 0, 0, 0.3)';

        hex.fill = hex.mouseOutColour;
        hex.selected = false;
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

      // option 1
      // selectableOptions.push(...[].concat(...selectedHexagonCodes.map(code => _getNewOptions(code, selectedHexagonCodes))));

      // option 2
      selectableOptions.push(..._getNewOptions(hexagonIndexCode, selectedHexagonCodes));
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

  for (let x = a * 1.8; x <= (width - a); x += a * 1.5) {
    var hexagonRow = []
    for (let y = a; y <= (height - a * 2); y += h) {
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
    selected: false,
    borderColor: 'rgba(0, 0, 0, 0)',
    clickedColour: 'rgba(0, 0, 0, 0.3)',
    mouseOverColour: 'rgba(0, 0, 0, 0.3)',
    fill: 'rgba(0, 0, 0, 0.3)'
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
