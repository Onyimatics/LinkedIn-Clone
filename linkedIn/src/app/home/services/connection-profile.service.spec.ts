import { TestBed } from '@angular/core/testing';

import { ConnectionProfileService } from './connection-profile.service';

describe('ConnectionProfileService', () => {
  let service: ConnectionProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
