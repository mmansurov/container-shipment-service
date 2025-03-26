import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { ShipmentListComponent } from './shipment-list.component';
import { ShipmentService } from '../../services/shipment.service';
import { ExecutionPlanService } from '../../services/execution-plan.service';
import { Shipment } from '../../models/shipment.model';
import { TransportType } from '../../models/transport-type.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { LoadingState } from '../../models/loading-state.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ShipmentListComponent', () => {
  let component: ShipmentListComponent;
  let fixture: ComponentFixture<ShipmentListComponent>;
  let shipmentService: jasmine.SpyObj<ShipmentService>;
  let executionPlanService: jasmine.SpyObj<ExecutionPlanService>;
  let planCreatedSubject: BehaviorSubject<void>;
  let shipmentsStateSubject: BehaviorSubject<LoadingState<Shipment>>;

  const mockShipments: Shipment[] = [
    { 
      id: 1, 
      origin: 'Hamburg', 
      destination: 'Rotterdam',
      transportType: TransportType.SEA,
      notifyCustomer: true,
      fragile: false,
      createdDate: new Date('2023-01-01').getTime()
    },
    {
      id: 2,
      origin: 'Paris',
      destination: 'Berlin',
      transportType: TransportType.ROAD,
      notifyCustomer: false,
      fragile: true,
      createdDate: new Date('2023-01-02').getTime()
    }
  ];

  beforeEach(async () => {
    planCreatedSubject = new BehaviorSubject<void>(undefined);
    shipmentsStateSubject = new BehaviorSubject<LoadingState<Shipment>>({
      data: mockShipments,
      loading: false
    });

    shipmentService = jasmine.createSpyObj('ShipmentService', ['getAllShipments'], {
      shipmentsState$: shipmentsStateSubject.asObservable()
    });

    executionPlanService = jasmine.createSpyObj('ExecutionPlanService', 
      ['createExecutionPlan', 'loadExecutionPlans'],
      { planCreated$: planCreatedSubject.asObservable() }
    );

    await TestBed.configureTestingModule({
      imports: [ 
        CommonModule,
        NoopAnimationsModule
      ],
      declarations: [ ShipmentListComponent ],
      providers: [
        { provide: ShipmentService, useValue: shipmentService },
        { provide: ExecutionPlanService, useValue: executionPlanService }
      ]
    })
    .overrideComponent(ShipmentListComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load shipments on init', () => {
      expect(shipmentService.getAllShipments).toHaveBeenCalled();
    });

    it('should subscribe to planCreated$ on init', async () => {
      planCreatedSubject.next();
      
      const selectedShipments = await firstValueFrom(component.selectedShipments$);
      expect(selectedShipments).toEqual([]);
      expect(executionPlanService.loadExecutionPlans).toHaveBeenCalled();
    });
  });

  describe('Shipment Selection', () => {
    it('should toggle shipment selection', async () => {
      const shipment = mockShipments[0];
      
      // Select shipment
      component.toggleShipmentSelection(shipment);
      const selected = await firstValueFrom(component.selectedShipments$);
      expect(selected).toContain(shipment);
      
      // Deselect shipment
      component.toggleShipmentSelection(shipment);
      const deselected = await firstValueFrom(component.selectedShipments$);
      expect(deselected).not.toContain(shipment);
    });

    it('should check if shipment is selected', () => {
      const shipment = mockShipments[0];
      expect(component.isSelected(shipment)).toBeFalse();
      
      component.toggleShipmentSelection(shipment);
      expect(component.isSelected(shipment)).toBeTrue();
    });
  });

  describe('Execution Plan Modal', () => {
    it('should not open modal when no shipments are selected', async () => {
      component.openExecutionPlanModal();
      
      const show = await firstValueFrom(component.showExecutionPlanModal$);
      expect(show).toBeFalse();
    });

    it('should open modal when shipments are selected', async () => {
      component.toggleShipmentSelection(mockShipments[0]);
      component.openExecutionPlanModal();
      
      const show = await firstValueFrom(component.showExecutionPlanModal$);
      expect(show).toBeTrue();
    });

    it('should close modal', async () => {
      component.closeExecutionPlanModal();
      
      const show = await firstValueFrom(component.showExecutionPlanModal$);
      expect(show).toBeFalse();
    });

    it('should handle create plan request', async () => {
      const request = {
        templateId: 1,
        shipmentIds: [1, 2]
      };

      component.onCreatePlanRequested(request);
      
      const creating = await firstValueFrom(component.isCreating$);
      expect(creating).toBeTrue();
      expect(executionPlanService.createExecutionPlan).toHaveBeenCalledWith(request);
    });

    it('should handle plan creation success', async () => {
      component.toggleShipmentSelection(mockShipments[0]);
      component.openExecutionPlanModal();
      
      planCreatedSubject.next();
      
      const [show, selected, creating] = await Promise.all([
        firstValueFrom(component.showExecutionPlanModal$),
        firstValueFrom(component.selectedShipments$),
        firstValueFrom(component.isCreating$)
      ]);

      expect(show).toBeFalse();
      expect(selected).toEqual([]);
      expect(creating).toBeFalse();
    });
  });

  describe('Transport Type Icons', () => {
    it('should return correct icon for transport types', () => {
      expect(component.getTransportTypeIcon(TransportType.AIR)).toBe('airplane');
      expect(component.getTransportTypeIcon(TransportType.ROAD)).toBe('truck');
      expect(component.getTransportTypeIcon(TransportType.SEA)).toBe('ship');
      expect(component.getTransportTypeIcon('invalid' as TransportType)).toBe('');
    });
  });

  describe('Cleanup', () => {
    it('should complete subjects on destroy', () => {
      const nextSpy = spyOn(component['destroy$'], 'next');
      const completeSpy = spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
