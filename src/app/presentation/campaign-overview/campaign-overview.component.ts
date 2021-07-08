import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CampaignService } from 'src/app/data/campaign.service';
import { Campaign } from 'src/app/domain/campaign.model';
import { Gang } from 'src/app/domain/gang.model';
import { Territory } from 'src/app/domain/territory.model';




@Component({
  selector: 'app-campaign-overview',
  templateUrl: './campaign-overview.component.html',
  styleUrls: ['./campaign-overview.component.css']
})
export class CampaignOverviewComponent {



  campaigns: Array<Campaign> =[]

  
  @Output() selectedCampaignChange = new EventEmitter<Campaign>()

  onSelect(campaign: Campaign) {
    this.selectedCampaignChange.emit(campaign);

  }

  constructor(
    private campaignService: CampaignService
  ) { }

  ngOnInit() {
    this.getCampaigns();
  }

  getCampaigns() {
    this.campaignService.getCampaigns()
      .subscribe(campaigns => this.campaigns = campaigns)
  }



}
