import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GangService } from 'src/app/data/gang.service';
import { Campaign } from 'src/app/domain/campaign.model';
import { Gang } from 'src/app/domain/gang.model'

@Component({
  selector: 'app-gangs-list',
  templateUrl: './gangs-list.component.html',
  styleUrls: ['./gangs-list.component.css']
})
export class GangsListComponent {

  gangs: any;

  @Input() campaignId!: number

  @Input() selectedGang!: Gang | null

  @Output() selectedGangChange = new EventEmitter<Gang>()



  onSelect(gang: Gang) {
    this.selectedGangChange.emit(gang)
  }

  constructor(
    private gangService: GangService,
  ) { }

 
  ngOnInit(){
    this.getGangs()
  }
  

  getGangs() {
   
    this.gangService.getGangs(this.campaignId)
      .subscribe(gangs => this.gangs = gangs)
  }

  
}
