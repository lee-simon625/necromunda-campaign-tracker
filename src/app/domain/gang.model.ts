export class Gang {


    constructor(
        public campaignID?: number,
        public id?: number,
        public player?: string,
        public name?: string,
        public gangType?: string,
        public totalValue?: number,
        public reputation?: number,
        public totalWins?: number

    ) {
    }

    static gangParse(gangObj: any) {
        console.log(gangObj);
        return new Gang(
            gangObj.campaignID,
            gangObj.id,
            gangObj.player,
            gangObj.name,
            gangObj.gangType,
            gangObj.totalValue,
            gangObj.reputation,
            gangObj.totalWins)
    }

}
