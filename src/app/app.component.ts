import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CampaignService} from './data/campaign.service';
import {Campaign} from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import {Territory} from './domain/territory.model';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import {seleniumWebDriverKeyMap} from "@angular/cdk/testing/selenium-webdriver/selenium-webdriver-keys";

class Hexagon {
  points: any[];
  centre: number[];
  sideLength: number;
  borderSize: number = 2;
  borderColor?: string;
  fill?: string;
  clickedColour?: string;
  mouseOverColour?: string;
  mouseOutColour?: string;
  selected: boolean = false;
  border: boolean = false;
  territory?: Territory;
  coord?: number[];
  code?: number;
  surroundingHexagons?: Hexagon[]
  hidden?: boolean = false;
  selectionFinished?: boolean = false;

  constructor(x: number, y: number, sideLength: number) {
    this.sideLength = sideLength;
    this.centre = [x, y];
    this.calcHexagonCoOrds();
    this.setColour();
  }

  // given an x,y location this builds the points for <polygon>
  calcHexagonCoOrds() {
    this.points = Array.from(Array(6).keys()).map(i => [
      this.centre[0] + this.sideLength * Math.cos(2 * Math.PI * i / 6),
      this.centre[1] + this.sideLength * Math.sin(2 * Math.PI * i / 6)
    ]);
  }

  hoverable(): boolean {
    return this.selected || (!this.border && this.selectionFinished)
  }

  setSelected(selected) {
    this.selected = selected;
    this.setColour();
  }

  selectionComplete() {
    this.selectionFinished = true;

    if (!!this.surroundingHexagons) {
      this.hidden = this.surroundingHexagons.filter(hex => hex.selected == true).length == 0;
      this.setColour();
    }
  }

  setTerritory(territory) {
    this.territory = territory;
    this.setColour();
  }

  setCoord(i, j) {
    this.coord = [i, j];
  }

  setCode(multiplier) {
    this.code = this.coord[0] + this.coord[1] * multiplier;
  }

  setColour() {
    if (this.hidden) {
      this.borderColor = 'rgba(0, 0, 0, 0)';
      this.clickedColour = 'rgba(0, 0, 0, 0)';
      this.mouseOverColour = 'rgba(0, 0, 0, 0)';
      this.mouseOutColour = 'rgba(0, 0, 0, 0)';

      this.fill = this.mouseOutColour;
    } else {
      if (this.selected) {
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

      } else {
        //  border
        this.borderColor = 'rgba(0, 0, 0, 0)';
        this.clickedColour = 'rgba(0, 0, 0, 0.3)';
        this.mouseOverColour = this.hoverable() ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.27)';
        this.mouseOutColour = 'rgba(0, 0, 0, 0.3)';

        this.fill = this.mouseOutColour;
      }
    }
  }

  assigneSurroundingHexagons(hex2dArray: Hexagon[][]) {
    const evenOddAdjust = (this.coord[0] % 2 == 0) ? -1 : 1;

    var surroundingCoords = [
      [this.coord[0], this.coord[1] + 1],
      [this.coord[0], this.coord[1] - 1],
      [this.coord[0] - 1, this.coord[1]],
      [this.coord[0] + 1, this.coord[1]],
      [this.coord[0] - 1, this.coord[1] + evenOddAdjust],
      [this.coord[0] + 1, this.coord[1] + evenOddAdjust],
    ]

    this.surroundingHexagons = surroundingCoords.filter(coord =>
      coord[0] >= 0 && coord[0] < rowLength &&
      coord[1] >= 0 && coord[1] < columnLength
    ).map(coord => {
      return hex2dArray[coord[0]][coord[1]]
    });
  }

  getAdditionalOptions(selectedHexagons) {
    return this.surroundingHexagons.filter(hex => !hex.border && !selectedHexagons.includes(hex));
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
  progressMode: ProgressBarMode = "buffer"
  territories: Territory[] = [
    {id: 1, name: "TERRITORY NAME 1", gangID: 2},
    {id: 2, name: "TERRITORY NAME 2", gangID: 1},
    {id: 3, name: "TERRITORY NAME 3", gangID: 1},
    {id: 4, name: "TERRITORY NAME 4", gangID: 2},
    {id: 5, name: "TERRITORY NAME 5", gangID: 2},
    {id: 6, name: "TERRITORY NAME 6", gangID: 2},
    {id: 7, name: "TERRITORY NAME 7", gangID: 3},
    {id: 8, name: "TERRITORY NAME 8", gangID: 1},
    {id: 10, name: "TERRITORY NAME 10", gangID: 3},
    {id: 11, name: "TERRITORY NAME 11", gangID: 3},
    {id: 12, name: "TERRITORY NAME 12", gangID: 3},
  ]

  height = 1000;
  viewBox = [0, 0, this.height, this.height];

  constructor() {
    a = _setHexSideLength(this.territories.length);
    h = Math.sqrt(3) * a;

    if (this.hexagon2DArray) {
      this.mode = Mode.Read
    } else {
      this.hexagon2DArray = _buildHexagonList(this.height, this.height, a);
    }

    this.hexagonList = [].concat(...this.hexagon2DArray);
  }

  onClick(hexagon) {
    if (hexagon.border)
      return;

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
        if (hexagon.selected && !hexagon.territory && !this.confirmReady()) {
          this.setTerritory(hexagon);
        }
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
    if (hexagon.mouseOverColour && !hexagon.border) {
      hexagon.fill = hexagon.mouseOverColour
    }
  }

  mouseOut(hexagon) {
    if (hexagon.mouseOutColour && !hexagon.border) {
      hexagon.fill = hexagon.mouseOutColour
    }
  }

  acceptShape() {
    this.hexagonList.forEach(hex => hex.selectionComplete());

    this.currentTerritory = _getNextTerritory(this.territories, this.assignedTerritoryCount);
    this.mode = Mode.Edit;
    this.progressMode = "determinate";
  }

  setTerritory(hex: Hexagon) {
    hex.setTerritory(this.currentTerritory);
    this.assignedTerritoryCount++
    this.currentTerritory = _getNextTerritory(this.territories, this.assignedTerritoryCount);
    this.setPercentageSelected();
  }

  createMode(): boolean {
    return this.mode == Mode.Create && !!this.selectedHexList && this.selectedHexList.length > 0;
  }

  editMode(): boolean {
    return this.mode == Mode.Edit && !!this.currentTerritory;
  }

  confirmReady(): boolean {
    return this.mode == Mode.Edit && this.editPercent == 100
  }

  readMode(): boolean {
    return this.mode == Mode.Read;
  }

  save() {
    console.log("SAVE!!!!!");
    this.mode = Mode.Read;
  }

  refreshEdit() {
    this.hexagonList.forEach(hex => hex.setTerritory(null));
    this.editPercent = 0;
    this.assignedTerritoryCount = 0;
    this.currentTerritory = _getNextTerritory(this.territories, this.assignedTerritoryCount);
  }

  selectHexagonMap(hex: Hexagon) {
    this.hexagonList.forEach(hex => hex.setSelected(false));

    this.selectedHexList = _selectHexagonsForTerritories(hex, this.territories.length);

    this.selectedHexList.forEach(hex => hex.setSelected(true));
  }
}

function _setHexSideLength(territoryCount): number {
  var decrementAccount = territoryCount > 9 ? territoryCount - 9 : 0

  return 90 - (decrementAccount * 2)
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

function _selectHexagonsForTerritories(seedHex, territoriesLength) {
  var selectedHexagons: Hexagon[] = [seedHex];
  var selectableOptions: Hexagon[] = seedHex.getAdditionalOptions(selectedHexagons)

  while (selectedHexagons.length < territoriesLength &&
  selectedHexagons.length < (columnLength * rowLength) - ((columnLength - 1) * 2) + ((rowLength - 1) * 2)) {

    var selectedHexagon: Hexagon = selectableOptions[getRandomArbitrary(1, selectableOptions.length - 1)];

    selectedHexagons.push(selectedHexagon);

    selectableOptions = selectableOptions.filter(hex => hex !== selectedHexagon);

    // option 1 broken
    // selectableOptions.push(...[].concat(...selectedHexagonCodes.map(code => _getNewOptions(code, selectedHexagonCodes))));

    // option 2 (FAV)
    selectableOptions.push(...selectedHexagon.getAdditionalOptions(selectedHexagons));

    // option 3 broken
    // selectableOptions.push(..._getNewOptions(hexagonIndexCode, selectedHexagonCodes));
    // selectableOptions = [...new Set(selectableOptions)];
  }

  return selectedHexagons;
}

function _buildHexagonList(width, height, sideLength) {
  var alternate = false;
  var hexagon2DList = [];

  for (let x = a * 1.5; x <= (width - a); x += a * 1.5) {
    var hexagonRow = []
    for (let y = a * 1.25; y <= (height - a * 2); y += h) {
      var hex: Hexagon = new Hexagon(x, alternate ? y + h / 2 : y, sideLength)
      hex.setCoord(hexagon2DList.length, hexagonRow.length);
      hexagonRow.push(hex);
    }
    alternate = !alternate
    hexagon2DList.push(hexagonRow);
  }

  rowLength = hexagon2DList.length;
  columnLength = hexagon2DList[0].length;

  hexagon2DList.forEach(column => column.forEach(hex => {
    hex.setCode(_multiplier());
    hex.assigneSurroundingHexagons(hexagon2DList);
    if (hex.coord[0] == 0 || hex.coord[1] == 0 || hex.coord[0] == rowLength - 1 || hex.coord[1] == columnLength - 1) {
      hex.border = true;
    }
  }));

  return hexagon2DList;
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function _multiplier() {
  return rowLength > columnLength ? rowLength : columnLength;
}
