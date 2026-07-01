import { TestBed } from '@angular/core/testing';

import { Btop } from './btop';

describe('Btop', () => {
  let service: Btop;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Btop);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
