import { Component } from '@angular/core';
import { CampaignService } from './data/campaign.service';
import { Campaign } from './domain/campaign.model';
import {Gang} from 'src/app/domain/gang.model'
import { Territory } from './domain/territory.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

   selectedCampaign: Campaign | null = null
 
   selectedGang: Gang | null = null

   selectedTerritory: Territory |  null = null
 
  title = 'Necromunda Campaign Tracker';



selectedCampaignChange(campaign : Campaign){
this.selectedCampaign = campaign;
this.selectedGang  = null;
this.selectedTerritory = null;
}

}



