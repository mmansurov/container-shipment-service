import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment } from '../../models/shipment.model';
import { TransportType } from '../../models/transport-type.model';
import { BehaviorSubject, map, takeUntil, Subject } from 'rxjs';
import { CreateExecutionPlanRequest } from '../../models/execution-plan.model';
import { ExecutionPlanService } from '../../services/execution-plan.service';

@Component({
    selector: 'app-shipment-list',
    templateUrl: './shipment-list.component.html',
    styleUrls: ['./shipment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentListComponent implements OnInit, OnDestroy {
    private selectedShipmentsSubject = new BehaviorSubject<Shipment[]>([]);
    private isCreatingSubject = new BehaviorSubject<boolean>(false);
    private showModalSubject = new BehaviorSubject<boolean>(false);
    private destroy$ = new Subject<void>();

    readonly shipmentsState$ = this.shipmentService.shipmentsState$;
    readonly selectedShipments$ = this.selectedShipmentsSubject.asObservable().pipe(
        map(shipments => shipments || [])
    );
    readonly isCreating$ = this.isCreatingSubject.asObservable();
    readonly showExecutionPlanModal$ = this.showModalSubject.asObservable();

    constructor(
        private readonly shipmentService: ShipmentService,
        private readonly executionPlanService: ExecutionPlanService
    ) {}

    ngOnInit(): void {
        this.loadShipments();
        this.executionPlanService.planCreated$.pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: () => {
                this.isCreatingSubject.next(false);
                this.showModalSubject.next(false);
                this.selectedShipmentsSubject.next([]);
                this.executionPlanService.loadExecutionPlans();
            },
            error: () => {
                this.isCreatingSubject.next(false);
            }
        });
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
        if (this.selectedShipmentsSubject.value.length > 0) {
            this.showModalSubject.next(true);
        }
    }

    closeExecutionPlanModal(): void {
        this.showModalSubject.next(false);
    }

    onCreatePlanRequested(request: CreateExecutionPlanRequest): void {
        this.isCreatingSubject.next(true);
        this.executionPlanService.createExecutionPlan(request);
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
