import { TestBed } from '@angular/core/testing';

import { CambiopasswordService } from './cambiopassword.service';

describe('CambiopasswordService', () => {
  let service: CambiopasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiopasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
