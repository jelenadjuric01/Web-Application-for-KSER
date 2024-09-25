import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendComponent } from './agend.component';

describe('AgendComponent', () => {
  let component: AgendComponent;
  let fixture: ComponentFixture<AgendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgendComponent]
    });
    fixture = TestBed.createComponent(AgendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
