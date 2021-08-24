import { Component, OnInit } from '@angular/core';
import { Campaign } from 'src/app/domain/campaign.model';
import { Form } from '@angular/forms';
import { CampaignService } from 'src/app/data/campaign.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent implements OnInit {


  constructor(
    private campaignService: CampaignService,
  ) { }

  ngOnInit(): void {
  }
  campaign:any
  campaignName: string ="";
  campaignNotes: string="";
  campaignPassword: string="";

  campaignId:any;
  

  newCampaign() {
    
    this.campaignService.createCampaign(this.campaign = new Campaign(undefined, this.campaignName, this.campaignNotes, this.campaignPassword)).subscribe(campaignId => this.campaignId = campaignId)
  }

  runWizard() {

  }

}



