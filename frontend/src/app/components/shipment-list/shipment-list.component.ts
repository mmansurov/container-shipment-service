import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment } from '../../models/shipment.model';
import { TransportType } from '../../models/transport-type.model';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-shipment-list',
    templateUrl: './shipment-list.component.html',
    styleUrls: ['./shipment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentListComponent implements OnInit {
    private selectedShipmentsSubject = new BehaviorSubject<Shipment[]>([]);
    readonly shipmentsState$ = this.shipmentService.shipmentsState$;
    readonly selectedShipments$ = this.selectedShipmentsSubject.asObservable();
    showExecutionPlanModal = false;

    constructor(
        private readonly shipmentService: ShipmentService,
    ) {}

    ngOnInit(): void {
        this.loadShipments();
    }

    loadShipments(): void {
        this.shipmentService.getAllShipments();
        this.selectedShipmentsSubject.next([]);
    }

    toggleShipmentSelection(shipment: Shipment): void {
        const currentSelection = this.selectedShipmentsSubject.value;
        const index = currentSelection.findIndex(s => s.id === shipment.id);
        
        const newSelection = index === -1
            ? [...currentSelection, shipment]
            : currentSelection.filter(s => s.id !== shipment.id);
            
        this.selectedShipmentsSubject.next(newSelection);
    }

    isSelected(shipment: Shipment): boolean {
        return this.selectedShipmentsSubject.value.some(s => s.id === shipment.id);
    }

    openExecutionPlanModal(): void {
        this.showExecutionPlanModal = true;
    }

    closeExecutionPlanModal(): void {
        this.showExecutionPlanModal = false;
    }

    onPlanCreated(): void {
        this.selectedShipmentsSubject.next([]);
    }

    getTransportTypeIcon(type: TransportType): string {
        switch (type) {
            case TransportType.AIR:
                return 'airplane';
            case TransportType.ROAD:
                return 'truck';
            case TransportType.SEA:
                return 'ship';
            default:
                return '';
        }
    }
}
