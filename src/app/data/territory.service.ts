import { Injectable } from '@angular/core';
import { AbstractDataService } from './abstractData.service';
import {Territory} from '../domain/territory.model'
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class TerritoryService extends AbstractDataService<Territory> {

  private territoryUrl = '/territory';  

  getTeritory(campaignID: number, id:number) {
    return this.get(`/${campaignID}/${this.territoryUrl}/${id}`);
  }

  getTerritories(campaignID: number) {
   
   return this.getAll(`/${campaignID}/${this.territoryUrl}`).pipe(
     map(jsonObj => {console.log(jsonObj)
      return jsonObj.map((obj: any) => Territory.territoryParse(obj))
    })
   );
 }

  createTeritory(campaignID: number, territory:Territory) {
    return this.create(`${campaignID}${this.territoryUrl}`, territory)
  }

  deleteTerritory(campaignID: number, id:number) {
    return this.delete(`${campaignID}${this.territoryUrl}/${id}`)
  }

  updateTerritory(campaignID: number, id:number, territory:Territory) {
    return this.update(`${campaignID}${this.territoryUrl}/${id}`, territory)
  }



}