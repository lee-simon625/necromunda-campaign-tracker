import { Injectable } from '@angular/core';
import { AbstractDataService } from './abstractData.service';
import { Gang } from '../domain/gang.model'
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GangService extends AbstractDataService<Gang> {

  private gangUrl = '/gang';  // URL to web api

  getGang(campaignID: number, id:number) {
    return this.get(`/${campaignID}/${this.gangUrl}/${id}`);
  }

  getGangs(campaignID: number) {   
    return this.getAll(`/${campaignID}/${this.gangUrl}`).pipe(
      map(jsonObj => {console.log(jsonObj)
      return jsonObj.map((obj: any) => Gang.gangParse(obj))
      }) 
    );
  }

  createGang(campaignID: number, gang:Gang) {
    return this.create(`/${campaignID}/${this.gangUrl}`, gang)
  }

  deleteGang(campaignID: number, id:number) {
    return this.delete(`/${campaignID}/${this.gangUrl}/${id}`)
  }

  updateGang(campaignID: number, id:number, gang:Gang) {
    return this.update(`/${campaignID}/${this.gangUrl}/${id}`, gang)
  }
}
