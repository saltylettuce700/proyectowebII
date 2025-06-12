import { TestBed } from '@angular/core/testing';

import { ResumenPedidoService } from './resumen-pedido.service';

describe('ResumenPedidoService', () => {
  let service: ResumenPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumenPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
