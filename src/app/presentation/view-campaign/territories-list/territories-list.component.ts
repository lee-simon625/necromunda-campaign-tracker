import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { TerritoryService } from 'src/app/data/territory.service';
import { Campaign } from 'src/app/domain/campaign.model';
import { Gang } from 'src/app/domain/gang.model'
import { Territory } from 'src/app/domain/territory.model';


@Component({
  selector: 'app-territories-list',
  templateUrl: './territories-list.component.html',
  styleUrls: ['./territories-list.component.css']
})
export class TerritoriesListComponent {

  territories: any;

  @Input() campaignId!: number

  @Input() selectedGang!: Gang | null

  @Input() selectedTerritory!: Territory | null

  @Output() selectedTerritoryChange = new EventEmitter<Territory>()


  onSelect(territory: Territory) {
    this.selectedTerritoryChange.emit(territory)
  }

  constructor(
    private territoryService: TerritoryService,
  ) { }

  
  ngOnInit (){
    this.getTerritories();
  }

  resetSelectedTerritory() {
    this.selectedTerritoryChange.emit()
  }

  getTerritories() {
   
      this.territoryService.getTerritories(this.campaignId)
        .subscribe(territories => this.territories = territories)
    

  }

}
