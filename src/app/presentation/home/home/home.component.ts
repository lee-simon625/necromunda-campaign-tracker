import {Component, OnInit} from '@angular/core';
import {CampaignService} from 'src/app/data/campaign.service';
import {MatDialog} from '@angular/material/dialog';
import {CampaignSelectorComponent} from '../campaign-selector/campaign-selector.component';
import {NewCampaignComponent} from '../new-campaign/new-campaign.component';
import {Territory} from "../../../domain/territory.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  campaigns: any;

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


  constructor(
    private campaignService: CampaignService,
    public dialog: MatDialog
  ) {
  }


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
        // height: '500px'
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
export class DialogContentExampleDialog {
}
