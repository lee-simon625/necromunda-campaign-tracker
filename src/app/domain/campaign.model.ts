import { JsonpClientBackend } from "@angular/common/http";
import { map } from "rxjs/operators";

export class Campaign {

    constructor(
        public id: number,
        public name?: string,
        public notes?: string
    ) {
    }

   static parse(campaignObj: any) {        
        console.log(campaignObj);
        return new Campaign(campaignObj.id,
            campaignObj.name,
            campaignObj.notes);
    }


}


