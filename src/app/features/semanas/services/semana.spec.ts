import { TestBed } from '@angular/core/testing';

import { Semana } from './semana';

describe('Semana', () => {
  let service: Semana;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Semana);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
