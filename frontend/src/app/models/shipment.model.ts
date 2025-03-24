import { TransportType } from './transport-type.model';

export interface Shipment {
  id: number;
  origin: string;
  destination: string;
  transportType: TransportType;
  createdDate: number;
  notifyCustomer: boolean;
  fragile: boolean;
}
