import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/data/campaign.service';
import { MatDialog } from '@angular/material/dialog';
import { CampaignSelectorComponent } from '../campaign-selector/campaign-selector.component';
import { NewCampaignComponent } from '../new-campaign/new-campaign.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  campaigns: any;


  constructor(
    private campaignService: CampaignService,
    public dialog: MatDialog

  ) { }


  // openDialog() {
  //   const dialogRef = this.dialog.open(DialogContentExampleDialog);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  viewCampaign(): void {
    let dialogref = this.dialog.open(CampaignSelectorComponent,
      {
        width: '500px',
        height: '250px'
      }
    );
  }

  newCampaign(): void {
    let dialogref = this.dialog.open(NewCampaignComponent,
      {
        width: '500px',
        height: '250px'
      }
    );
  }

  ngOnInit() {
  }

  // getCampaigns() {
  //   this.campaignService.getCampaigns()
  //     .subscribe(campaigns => this.campaigns = campaigns)
  // }



}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog { }