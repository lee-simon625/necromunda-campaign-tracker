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

  @Input() selectedCampaign!: Campaign | null

  @Input() selectedGang!: Gang | null

  @Input() selectedTerritory!: Territory | null

  @Output() selectedTerritoryChange = new EventEmitter<Territory>()


  onSelect(territory: Territory) {
    this.selectedTerritoryChange.emit(territory)
  }

  constructor(
    private territoryService: TerritoryService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCampaign) {
      this.getTerritories();
    }
  }

  resetSelectedTerritory() {
    this.selectedTerritoryChange.emit()
  }

  getTerritories() {
    if (this.selectedCampaign) {
      this.territoryService.getTerritories(this.selectedCampaign.id)
        .subscribe(territories => this.territories = territories)
    }

  }

}
