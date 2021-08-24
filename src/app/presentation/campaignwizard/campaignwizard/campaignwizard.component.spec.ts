import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignwizardComponent } from './campaignwizard.component';

describe('CampaignwizardComponent', () => {
  let component: CampaignwizardComponent;
  let fixture: ComponentFixture<CampaignwizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignwizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignwizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
