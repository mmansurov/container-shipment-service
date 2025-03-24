import { TransportType } from './transport-type.model';

export interface Shipment {
  id: number,
  origin: string,
  destination?: string,
  customerId: string,
  createdDate: number,
  fragile: boolean,
  notifyCustomer: boolean,
  transportType: TransportType,
  temperatureRange: TemperatureRange
}

export interface TemperatureRange {
  id: number,
  min: number,
  max: number
}
