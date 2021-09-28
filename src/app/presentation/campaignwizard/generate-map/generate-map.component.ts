import {Component} from '@angular/core';
import {Territory} from '../../../domain/territory.model';
import {ProgressBarMode} from '@angular/material/progress-bar';
import {Hexagon} from "../../../domain/hexagon.model";

enum Mode {
  New,
  Create,
  Edit,
  Read,
}


@Component({
  selector: 'app-generate-map',
  templateUrl: './generate-map.component.html',
  styleUrls: ['./generate-map.component.css']
})
export class GenerateMapComponent {

  hexagon2DArray: Hexagon[][];
  hexagonList: Hexagon[];
  selectedHexList: Hexagon[];

  mode: Mode = Mode.New;

  progressMode: ProgressBarMode = "buffer"
  assignableTerritories: Territory[] = [];

  territories: Territory[] = [
    {id: 1, name: "TERRITORY NAME 1", gangID: 2},
    {id: 2, name: "TERRITORY NAME 2"},
    {id: 3, name: "TERRITORY NAME 3"},
    {id: 4, name: "TERRITORY NAME 4"},
    {id: 5, name: "TERRITORY NAME 5"},
    {id: 6, name: "TERRITORY NAME 6"},
    {id: 7, name: "TERRITORY NAME 7"},
    {id: 8, name: "TERRITORY NAME 8"},
    {id: 8, name: "TERRITORY NAME 9"},
    {id: 10, name: "TERRITORY NAME 10", gangID: 3},
    {id: 8, name: "TERRITORY NAME 8", gangID: 1},
    {id: 8, name: "TERRITORY NAME 9"},
    {id: 10, name: "TERRITORY NAME 10"},
    {id: 11, name: "TERRITORY NAME 11"},
    {id: 12, name: "TERRITORY NAME 12"},
  ]

  height = 2000;
  viewBox = [0, 0, this.height, this.height];

  constructor() {
    var sideLength = (80 - ((this.territories.length > 9 ? this.territories.length - 9 : 0) * 2)) * (this.height/1000)

    if (this.hexagon2DArray) {
      this.mode = Mode.Read
    } else {
      this.hexagon2DArray = _buildHexagonList(this.height, this.height, sideLength);
      this.postHexagonCreation();
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
        if (hexagon.selected) {
          if (hexagon.territory) {
            this.removeTerritory(hexagon);
          } else {
            this.setTerritory(hexagon);
          }
        }
        break;

      case Mode.Read:

        break;
    }
  }

  percentageSelected() : number {
    if (!this.editMode()) {
      return 0;
    }

    var territoryCount = this.territories.filter(terr => terr.gangID).length;
    return (territoryCount - this.assignableTerritories.length) / (territoryCount / 100);
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

    this.assignableTerritories = this.territories.filter(terr => terr.gangID);
    this.mode = Mode.Edit;
    this.progressMode = "determinate";
  }

  removeTerritory(hexagon:Hexagon) {
    this.assignableTerritories.unshift(hexagon.territory);
    hexagon.setTerritory(null);
  }

  setTerritory(hex: Hexagon) {
    hex.setTerritory(this.assignableTerritories[0]);
    this.assignableTerritories.shift();
  }

  createMode(): boolean {
    return this.mode == Mode.Create && !!this.selectedHexList && this.selectedHexList.length > 0;
  }

  editMode(): boolean {
    return this.mode == Mode.Edit;
  }

  addingTerritoriesMode(): boolean {
    return this.editMode() && this.assignableTerritories.length > 0;
  }

  confirmReady(): boolean {
    return this.editMode() && this.percentageSelected() == 100
  }

  readMode(): boolean {
    return this.mode == Mode.Read;
  }

  save() {
    console.log("SAVE!!!!!");
    this.progressMode = "buffer";
    this.mode = Mode.Read;
  }

  refreshEdit() {
    this.hexagonList.forEach(hex => hex.setTerritory(null));
    this.assignableTerritories = this.territories.filter(terr => terr.gangID);
    this.percentageSelected();
  }

  rowLength():number {
    return this.hexagon2DArray.length;
  }

  columnLength():number {
    return this.hexagon2DArray[0].length;
  }

  hexagonArea(): number {
    return (this.columnLength() * this.rowLength()) - ((this.columnLength() - 1) * 2) + ((this.rowLength() - 1) * 2)
  }

  postHexagonCreation() {
    this.hexagon2DArray.forEach(column => column.forEach(hex => {
      hex.assigneSurroundingHexagons(this.hexagon2DArray, this.rowLength(), this.columnLength());
      if (hex.coord[0] == 0 || hex.coord[1] == 0 || hex.coord[0] == this.rowLength() - 1 || hex.coord[1] == this.columnLength() - 1) {
        hex.border = true;
      }
    }));
  }

  selectHexagonMap(hex: Hexagon) {
    this.hexagonList.forEach(hex => hex.setSelected(false));

    this.selectedHexList = _selectHexagonsForTerritories(hex, this.territories.length, this.hexagonArea());

    this.selectedHexList.forEach(hex => hex.setSelected(true));
  }
}

function _selectHexagonsForTerritories(seedHex, territoriesLength, hexagonArea) {
  var selectedHexagons: Hexagon[] = [seedHex];
  var selectableOptions: Hexagon[] = seedHex.getAdditionalOptions(selectedHexagons)

  while (selectedHexagons.length < territoriesLength &&
  selectedHexagons.length < hexagonArea) {

    var selectedHexagon: Hexagon = selectableOptions[_getRandomArbitrary(1, selectableOptions.length - 1)];

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
  var h = Math.sqrt(3) * sideLength;
  var alternate = false;
  var hexagon2DList: Hexagon[][] = [];

  for (let x = sideLength * 1.5; x <= (width - sideLength); x += sideLength * 1.5) {
    var hexagonRow: Hexagon[] = []
    for (let y = sideLength * 1.25; y <= (height - sideLength * 2); y += h) {
      var hex: Hexagon = new Hexagon(x, alternate ? y + h / 2 : y, sideLength)
      hex.setCoord(hexagon2DList.length, hexagonRow.length);
      hexagonRow.push(hex);
    }
    alternate = !alternate
    hexagon2DList.push(hexagonRow);
  }

  return hexagon2DList;
}

function _getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
