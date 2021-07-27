import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CampaignService } from 'src/app/data/campaign.service';
import { Campaign } from 'src/app/domain/campaign.model';
import { Gang } from 'src/app/domain/gang.model';
import { Territory } from 'src/app/domain/territory.model';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.css']
})
export class CampaignViewComponent {

  campaignId: any;

  campaign: any 

  selectedGang: Gang | null = null

  selectedTerritory: Territory | null = null



  ngOnInit() {
    this.route.params.subscribe(event => {
      this.campaignId = event.id;
    });
    this.getCampaign(this.campaignId)
  }


  getCampaign(campaignId: number) {
    this.campaignService.getCampaign(campaignId)
      .subscribe((campaign: any) => this.campaign = campaign)
  }







  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute
  ) { }



}
