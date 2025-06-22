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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
