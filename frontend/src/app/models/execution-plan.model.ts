import { TransportType } from './transport-type.model';

export interface ExecutionPlan {
  id: number;
  origin: string;
  destination: string;
  notifyCustomer: boolean;
  transportType: TransportType;
  fragile: boolean;
}
