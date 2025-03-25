import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shipment } from '../models/shipment.model';
import { environment } from '../../environments/environment';
import { LoadingState } from '../models/loading-state.model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private apiUrl = `${environment.apiUrl}/shipments`;
  private shipmentsSubject = new BehaviorSubject<LoadingState<Shipment>>({ data: [], loading: true });
  shipmentsState$: Observable<LoadingState<Shipment>> = this.shipmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAllShipments();
  }

  getAllShipments(): void {
    this.http.get<Shipment[]>(this.apiUrl).subscribe(
      shipments => this.shipmentsSubject.next({ data: shipments, loading: false }),
    );
  }
}
