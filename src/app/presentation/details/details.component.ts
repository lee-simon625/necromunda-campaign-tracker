import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from 'src/app/domain/campaign.model';
import { Gang } from 'src/app/domain/gang.model';
import { Territory } from 'src/app/domain/territory.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() selectedCampaign!: Campaign | null

  @Input() selectedGang!: Gang | null

  @Input() selectedTerritory!: Territory | null

  
  constructor() { }

  ngOnInit(): void {
  }

}
