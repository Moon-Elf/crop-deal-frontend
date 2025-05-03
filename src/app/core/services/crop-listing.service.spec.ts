import { TestBed } from '@angular/core/testing';

import { CropListingService } from './crop-listing.service';

describe('CropListingService', () => {
  let service: CropListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CropListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
