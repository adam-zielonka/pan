import { TestBed, inject } from '@angular/core/testing'

import { PanService } from './pan.service'

describe('PanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PanService]
    })
  })

  it('should be created', inject([PanService], (service: PanService) => {
    expect(service).toBeTruthy()
  }))
})
