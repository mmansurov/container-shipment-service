import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Shipment } from '../models/shipment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private apiUrl = `${environment.apiUrl}/shipments`;
  private shipmentsSubject = new Subject<Shipment[]>();

  shipments$ = this.shipmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAllShipments();
  }

  getAllShipments(): void {
    this.http.get<Shipment[]>(this.apiUrl)
      .subscribe(shipments => this.shipmentsSubject.next(shipments));
  }
}