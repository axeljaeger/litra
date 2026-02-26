import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLampControlComponent } from './single-lamp-control.component';
import { provideZonelessChangeDetection } from '@angular/core';

import { describe, it, expect, beforeEach } from 'vitest';

describe('SingleLampControlComponent', () => {
  let component: SingleLampControlComponent;
  let fixture: ComponentFixture<SingleLampControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SingleLampControlComponent],
      providers: [provideZonelessChangeDetection()]
    });
    fixture = TestBed.createComponent(SingleLampControlComponent);
    component = fixture.componentInstance;

    const deviceMock = {
      sendReport: async () => { /* mock implementation */ }
    } as unknown as HIDDevice;

    fixture.componentRef.setInput('hidDevice', deviceMock); // Mock HIDDevice input
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
