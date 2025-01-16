import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessspeechComponent } from './processspeech.component';

describe('ProcessspeechComponent', () => {
  let component: ProcessspeechComponent;
  let fixture: ComponentFixture<ProcessspeechComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessspeechComponent]
    });
    fixture = TestBed.createComponent(ProcessspeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
