export class Territory {

   constructor(
    public  campaignID?: number,
    public  gangID?: number,
    public  id?: number,
    public  name?: string,
    public  income?: string ,
    public  recruit?: string ,
    public  equipment?: string ,
    public  special?: string ,
    public  reputation?: number,
    public  gangIncome?: string ,
    public  gangRecruit?: string ,
    public  gangEquipment?: string ,
    public  gangSpecial?: string ,
    public  gangReputation?: string,
    public  mapLocation?: string
) {
}

static territoryParse(terObj: any) {
    console.log(terObj);
    return new Territory(
        terObj.campaignID,
        terObj.gangID,
        terObj.id,
        terObj.name,
        terObj.income,
        terObj.recruit,
        terObj.equipment,
        terObj.special,
        terObj.reputation,
        terObj.gangIncome,
        terObj.gangRecruit,
        terObj.gangEquipment,
        terObj.gangSpecial,
        terObj.gangReputation,
        terObj.mapLocation
    )
}



}
