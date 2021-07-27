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
    CampaignSelectorComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes,
      { enableTracing: true }),
    MatDialogModule,
   
    BrowserAnimationsModule
  ],

  entryComponents: [
    CampaignSelectorComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
