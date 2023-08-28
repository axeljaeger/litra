import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLampControlComponent } from './single-lamp-control.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SingleLampControlComponent', () => {
  let component: SingleLampControlComponent;
  let fixture: ComponentFixture<SingleLampControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SingleLampControlComponent, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(SingleLampControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
