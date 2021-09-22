import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CampaignService} from './data/campaign.service';
import {Campaign} from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import {Territory} from './domain/territory.model';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';

class Hexagon {
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

  setColour(selected: boolean) {
    if (selected) {
      //  selected
      var r = 50;
      var g = 50;
      var b = 50;

      if (this.territory && this.territory.gangID)
        switch (this.territory.gangID) {
          case 1:
            r = 200
            break;
          case 2:
            g = 200
            break;
          case 3:
            b = 200
            break;
        }

      this.borderColor = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
      this.clickedColour = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.8)';
      this.mouseOverColour = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.5)';
      this.mouseOutColour = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.2)';

      this.fill = this.mouseOutColour;
      this.selected = true;

    } else {
      //  border
      this.borderColor = 'rgba(0, 0, 0, 0)';
      this.clickedColour = 'rgba(0, 0, 0, 0.3)';
      this.mouseOverColour = 'rgba(0, 0, 0, 0.3)';
      this.mouseOutColour = 'rgba(0, 0, 0, 0.3)';

      this.fill = this.mouseOutColour;
      this.selected = false;
    }
  }
}

enum Mode {
  New,
  Create,
  Edit,
  Read,
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

  hexagon2DArray: Hexagon[][];
  hexagonList: Hexagon[];
  selectedHexList: Hexagon[];

  mode: Mode = Mode.New;

  currentTerritory: Territory;
  assignedTerritoryCount: number = 0;
  editPercent = 0;
  territories: Territory[] = [
    {id: 1, gangID: 2, name: "THIS IS NAME 1"},
    {id: 2, gangID: 1, name: "THIS IS NAME 2"},
    {id: 3, name: "THIS IS NAME 3"},
    {id: 4, name: "THIS IS NAME 4"},
    {id: 5, name: "THIS IS NAME 5"},
    {id: 6, name: "THIS IS NAME 6"},
    {id: 7, name: "THIS IS NAME 7"},
    {id: 8, name: "THIS IS NAME 8"},
    {id: 9, name: "THIS IS NAME 9"},
    {id: 10, gangID: 3, name: "THIS IS NAME 10"},
    {id: 11, name: "THIS IS NAME 11"},
    {id: 12, name: "THIS IS NAME 12"},
  ]

  height = 1000;
  viewBox = [0, 0, this.height, this.height];

  constructor() {
    a = _setHexSideLength(this.territories.length);
    h = Math.sqrt(3) * a;

    if (this.hexagon2DArray) {
      this.mode = Mode.Read
    } else {
      this.hexagon2DArray = _buildHexagonList(this.height, this.height);
    }

    this.hexagonList = [].concat(...this.hexagon2DArray);
  }

  onClick(hexagon) {
    console.log("The mode when clicked is : " + this.mode);
    switch (this.mode) {
      case Mode.New:
        this.selectHexagonMap(hexagon);
        if (this.selectedHexList)
          this.mode = Mode.Create
        break;
      case Mode.Create:
        this.selectHexagonMap(hexagon);
        break;
      case Mode.Edit:
        this.setTerritory(hexagon);
        break;
      case Mode.Read:

        break;
    }
  }

  setPercentageSelected() {
    var total = this.territories.filter(terr => terr.gangID).length

    var val = this.assignedTerritoryCount / (total / 100);

    this.editPercent = val;
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

  acceptShape() {
    this.currentTerritory = _getNextTerritory(this.territories, this.assignedTerritoryCount);
    this.mode = Mode.Edit;
  }

  setTerritory(hex) {
    hex.territory = this.currentTerritory;
    this.assignedTerritoryCount++
    this.currentTerritory = _getNextTerritory(this.territories, this.assignedTerritoryCount);
    this.setPercentageSelected();

    if (this.currentTerritory == null) {
      this.mode = Mode.Read;
    }
  }

  createMode(): boolean {
    return this.mode == Mode.Create;
  }

  editMode(): boolean {
    return (this.mode == Mode.Edit && !!this.currentTerritory);
  }

  readMode(): boolean {
    return this.mode == Mode.Read;
  }

  selectHexagonMap(hex) {
    var seedCoord = hex.location;
    if (seedCoord[0] > 0 && seedCoord[0] < rowLength - 1 &&
      seedCoord[1] > 0 && seedCoord[1] < columnLength - 1) {

      var selectedHexagonCodes = _selectHexagonsForTerritories(hex.location, this.territories.length);

      this.selectedHexList = _codeListToHexList(selectedHexagonCodes, this.hexagon2DArray);
      // this.selectedHexList.forEach((hex, i) => hex.territory = this.territories[i]);

      _setSelectedColours(selectedHexagonCodes, this.hexagon2DArray);
    }
  }
}

function _getNextTerritory(territories, completeCount) {
  var ownedTerritories = 0;
  var terr: Territory = null;
  territories.forEach(territory => {
    if (territory.gangID) {
      if (completeCount == ownedTerritories) {
        terr = territory;
      }
      ownedTerritories++
    }
  });

  return terr;
}

function _codeListToHexList(codeList, hexagon2DArray) {
  var hexList = [];

  hexagon2DArray.forEach((row, x) => {
    row.forEach((hex, y) => {
      if (codeList.includes(_coordToCode([x, y]))) {
        hexList.push(hex)
      }
    });
  });

  return hexList;
}

function _setHexSideLength(territoryCount): number {
  var decrementAccount = territoryCount > 9 ? territoryCount - 9 : 0

  return 90 - (decrementAccount * 2)
}

function _setSelectedColours(codeList, hexagon2DArray) {
  hexagon2DArray.forEach((row, x) => {
    row.forEach((hex, y) => {
      // letting the hex know if it is selected or not
      hex.setColour(codeList.includes(_coordToCode([x, y])));
    });
  });
}

function _selectHexagonsForTerritories(seedCoord, territoriesLength) {
  var selectedHexagonCodes: number[] = [_coordToCode(seedCoord)];
  var selectableOptions: number[] = _getNewOptions(_coordToCode(seedCoord), selectedHexagonCodes);

  while (selectedHexagonCodes.length < territoriesLength &&
  selectedHexagonCodes.length < (columnLength * rowLength) - ((columnLength - 1) * 2) + ((rowLength - 1) * 2)) {

    var hexagonIndexCode: number = selectableOptions[getRandomArbitrary(1, selectableOptions.length - 1)];

    if (!selectedHexagonCodes.includes(hexagonIndexCode)) {

      selectedHexagonCodes.push(hexagonIndexCode);

      selectableOptions = selectableOptions.filter(code => code !== hexagonIndexCode);

      // option 1
      // selectableOptions.push(...[].concat(...selectedHexagonCodes.map(code => _getNewOptions(code, selectedHexagonCodes))));

      // option 2
      // selectableOptions.push(..._getNewOptions(hexagonIndexCode, selectedHexagonCodes));

      // option 3
      selectableOptions.push(..._getNewOptions(hexagonIndexCode, selectedHexagonCodes));
      selectableOptions = [...new Set(selectableOptions)];
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

  for (let x = a * 1.5; x <= (width - a); x += a * 1.5) {
    var hexagonRow = []
    for (let y = a * 1.25; y <= (height - a * 2); y += h) {
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
