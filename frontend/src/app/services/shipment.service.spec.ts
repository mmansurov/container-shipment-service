import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShipmentService } from './shipment.service';
import { Shipment } from '../models/shipment.model';
import { TransportType } from '../models/transport-type.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

describe('ShipmentService', () => {
  let service: ShipmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShipmentService]
    });
    service = TestBed.inject(ShipmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    // Handle the initial HTTP request from constructor
    const req = httpMock.expectOne(`${environment.apiUrl}/shipments`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
    
    expect(service).toBeTruthy();
  });

  it('should fetch shipments and update state on initialization', async () => {
    // Given
    const mockShipments: Shipment[] = [
      {
        id: 1,
        origin: 'Hamburg',
        destination: 'Rotterdam',
        transportType: TransportType.SEA,
        createdDate: Date.now(),
        notifyCustomer: true,
        fragile: false
      },
      {
        id: 2,
        origin: 'Berlin',
        destination: 'Paris',
        transportType: TransportType.ROAD,
        createdDate: Date.now(),
        notifyCustomer: false,
        fragile: true
      }
    ];

    // When
    const initialState = await firstValueFrom(service.shipmentsState$);
    expect(initialState.loading).toBe(true);
    expect(initialState.data).toEqual([]);

    // Then
    const req = httpMock.expectOne(`${environment.apiUrl}/shipments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShipments);

    const loadedState = await firstValueFrom(service.shipmentsState$);
    expect(loadedState.loading).toBe(false);
    expect(loadedState.data).toEqual(mockShipments);
  });

  it('should handle empty response', async () => {
    // Handle the initial HTTP request from constructor
    const req = httpMock.expectOne(`${environment.apiUrl}/shipments`);
    req.flush([]);

    const state = await firstValueFrom(service.shipmentsState$);
    expect(state.loading).toBe(false);
    expect(state.data).toEqual([]);
  });
});
