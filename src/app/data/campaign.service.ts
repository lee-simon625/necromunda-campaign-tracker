import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Campaign } from '../domain/campaign.model'
import { AbstractDataService } from './abstractData.service';


@Injectable({
  providedIn: 'root'
})
export class CampaignService extends AbstractDataService<Campaign>  {



  getCampaign(id: number) {
    return this.get(`/${id}`).pipe(
      map(jsonObj => {console.log(jsonObj)
        return jsonObj.map((obj: any) =>  Campaign.campaignParse(obj))
      })
    );
  }

  getCampaigns() {

    return this.getAll("").pipe(
      map(jsonObj => {console.log(jsonObj)
        return jsonObj.map((obj: any) =>  Campaign.campaignParse(obj))
      })
    );
  }

  createCampaign(campaign: Campaign) {
    console.log(JSON.parse(JSON.stringify(campaign)))
    return this.create("/new", JSON.parse(JSON.stringify(campaign)))
  }

  deleteCampaign(id: number) {
    return this.delete(`/${id}`)
  }

  updateCampaign(id: number, campaign: Campaign) {
    return this.update(`/${id}`, campaign)
  }

}