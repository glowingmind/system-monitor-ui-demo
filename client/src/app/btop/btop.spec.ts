import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Btop } from './btop';

describe('Btop', () => {
  let component: Btop;
  let fixture: ComponentFixture<Btop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Btop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Btop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
