import {Territory} from "./territory.model";

export class Hexagon {
  points: any[];
  sideLength: number;
  borderColor?: string;
  fill?: string;
  clickedColour?: string;
  mouseOverColour?: string;
  mouseOutColour?: string;
  territory?: Territory;
  territory_id?: number;
  surroundingHexagons?: Hexagon[] = [];

  centre: number[];
  coord?: number[];
  selected: boolean = false;
  border: boolean = false;
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

  assigneSurroundingHexagons(hex2dArray: Hexagon[][], rowLength, columnLength ) {
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
