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
    return this.get(`/${id}`)
  }

  getCampaigns() {

    return this.getAll("").pipe(
      map(jsonObj => {console.log(jsonObj)
        // var jsonObj = JSON.parse(str)
        return jsonObj.map((obj: any) =>  Campaign.parse(obj))
      })
    );
  }

  createCampaign(campaign: Campaign) {
    return this.create("", campaign)
  }

  deleteCampaign(id: number) {
    return this.delete(`/${id}`)
  }

  updateCampaign(id: number, campaign: Campaign) {
    return this.update(`/${id}`, campaign)
  }

}