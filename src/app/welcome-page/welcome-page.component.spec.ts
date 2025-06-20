import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePageComponent } from './welcome-page.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WelcomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WelcomePageComponent],
      providers: [provideZonelessChangeDetection()]
    });
    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
