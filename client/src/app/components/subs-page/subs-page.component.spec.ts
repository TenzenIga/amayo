import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsPageComponent } from './subs-page.component';

describe('SubsPageComponent', () => {
  let component: SubsPageComponent;
  let fixture: ComponentFixture<SubsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
