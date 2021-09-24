import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CampaignViewComponent } from './presentation/view-campaign/campaign-view/campaign-view.component';
import { GangsListComponent } from './presentation/view-campaign/gangs-list/gangs-list.component';
import { TerritoriesListComponent } from './presentation/view-campaign/territories-list/territories-list.component';
import { DetailsComponent } from './presentation/view-campaign/details/details.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './presentation/home/home/home.component';
import { CampaignSelectorComponent } from './presentation/home/campaign-selector/campaign-selector.component';
import { MatDialogActions, MatDialogContent, MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewCampaignComponent } from './presentation/home/new-campaign/new-campaign.component';
import { FormsModule } from '@angular/forms';
import { GangsEditComponent } from './presentation/edit-campaign/gangs-edit/gangs-edit.component';
import { TerritoriesEditComponent } from './presentation/edit-campaign/territories-edit/territories.component';
import { CampaignEditComponent } from './presentation/edit-campaign/campaign-edit/campaign-edit.component';
import { CampaignwizardComponent } from './presentation/campaignwizard/campaignwizard/campaignwizard.component';
import { NgxSvgModule } from 'ngx-svg';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { GenerateMapComponent } from './presentation/campaignwizard/generate-map/generate-map.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'view/:id', component: CampaignViewComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    CampaignViewComponent,
    GangsListComponent,
    TerritoriesListComponent,
    DetailsComponent,
    HomeComponent,
    CampaignSelectorComponent,
    NewCampaignComponent,
    GangsEditComponent,
    TerritoriesEditComponent,
    CampaignEditComponent,
    CampaignwizardComponent,
    GenerateMapComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes,
      {enableTracing: true}),
    MatDialogModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSvgModule,
    MatButtonModule,
    MatStepperModule,
    MatProgressBarModule
  ],
  entryComponents: [
    CampaignSelectorComponent,
    NewCampaignComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
