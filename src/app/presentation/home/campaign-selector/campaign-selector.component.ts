import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/data/campaign.service';
import { Campaign } from 'src/app/domain/campaign.model';

@Component({
  selector: 'app-campaign-selector',
  templateUrl: './campaign-selector.component.html',
  styleUrls: ['./campaign-selector.component.css']
})
export class CampaignSelectorComponent implements OnInit {
  campaigns: any;

  constructor(
    private campaignService: CampaignService,
    private router: Router,
    public dialogRef: MatDialogRef<CampaignSelectorComponent>

  ) { }

  ngOnInit(): void {
    this.getCampaigns()
  }


  routerToCampaignId(campaign: Campaign) {
    this.router.navigate(['/view/' + campaign.id])
  }


  getCampaigns() {
    this.campaignService.getCampaigns()
      .subscribe((campaigns: any) => this.campaigns = campaigns)
  }


}
