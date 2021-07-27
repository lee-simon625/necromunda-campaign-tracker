export class Campaign {

    constructor(
        public id: number,
        public name?: string,
        public notes?: string
    ) {
    }

    static campaignParse(campaignObj: any) {
        console.log(campaignObj);
        return new Campaign(
            campaignObj.id,
            campaignObj.name,
            campaignObj.notes);
    }


}


