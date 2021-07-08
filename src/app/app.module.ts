import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CampaignOverviewComponent } from './presentation/campaign-overview/campaign-overview.component';
import { GangsListComponent } from './presentation/gangs-list/gangs-list.component';
import { TerritoriesListComponent } from './presentation/territories-list/territories-list.component';
import { DetailsComponent } from './presentation/details/details.component';


@NgModule({
  declarations: [
    AppComponent,
    CampaignOverviewComponent,
    GangsListComponent,
    TerritoriesListComponent,
    DetailsComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
