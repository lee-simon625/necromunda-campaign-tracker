import { Campaign } from "../domain/campaign.model";



var selectedCampaign:Campaign;

function setCampaign(campaign:Campaign) {
selectedCampaign = campaign;
}

function getCampaignId() {
return selectedCampaign.id;
}
