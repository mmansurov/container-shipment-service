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

  it('should fetch shipments on initialization', async () => {
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
    const shipmentsPromise = firstValueFrom(service.shipments$);

    // Then
    const req = httpMock.expectOne(`${environment.apiUrl}/shipments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShipments);

    const receivedShipments = await shipmentsPromise;
    expect(receivedShipments).toEqual(mockShipments);
  });

  it('should fetch shipments when getAllShipments is called', async () => {
    // Given
    const mockShipments: Shipment[] = [
      {
        id: 3,
        origin: 'New York',
        destination: 'London',
        transportType: TransportType.AIR,
        createdDate: Date.now(),
        notifyCustomer: true,
        fragile: true
      },
      {
        id: 4,
        origin: 'Singapore',
        destination: 'Tokyo',
        transportType: TransportType.SEA,
        createdDate: Date.now(),
        notifyCustomer: false,
        fragile: false
      }
    ];

    // Handle the initial HTTP request from constructor
    const initialReq = httpMock.expectOne(`${environment.apiUrl}/shipments`);
    initialReq.flush([]);

    // When
    const shipmentsPromise = firstValueFrom(service.shipments$);
    service.getAllShipments();

    // Then
    const req = httpMock.expectOne(`${environment.apiUrl}/shipments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShipments);

    const receivedShipments = await shipmentsPromise;
    expect(receivedShipments).toEqual(mockShipments);
  });
});
