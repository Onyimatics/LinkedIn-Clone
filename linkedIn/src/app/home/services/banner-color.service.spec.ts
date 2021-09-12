import { TestBed } from '@angular/core/testing';

import { BannerColorService } from './banner-color.service';

describe('BannerColorService', () => {
  let service: BannerColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannerColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
