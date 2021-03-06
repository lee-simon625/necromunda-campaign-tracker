import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoriesListComponent } from './territories-list.component';

describe('TerritoriesListComponent', () => {
  let component: TerritoriesListComponent;
  let fixture: ComponentFixture<TerritoriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoriesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
