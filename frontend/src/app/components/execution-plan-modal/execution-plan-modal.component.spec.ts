import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExecutionPlanModalComponent } from './execution-plan-modal.component';
import { TemplateService } from '../../services/template.service';
import { ExecutionPlanService } from '../../services/execution-plan.service';
import { of } from 'rxjs';
import { Shipment } from '../../models/shipment.model';
import { TransportType } from '../../models/transport-type.model';
import { firstValueFrom } from 'rxjs';

describe('ExecutionPlanModalComponent', () => {
  let component: ExecutionPlanModalComponent;
  let fixture: ComponentFixture<ExecutionPlanModalComponent>;
  let templateService: jasmine.SpyObj<TemplateService>;
  let executionPlanService: jasmine.SpyObj<ExecutionPlanService>;

  const mockTemplates = [
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' }
  ];

  const mockShipments: Shipment[] = [
    {
      id: 1,
      origin: 'Hamburg',
      destination: 'Rotterdam',
      transportType: TransportType.SEA,
      createdDate: Date.now(),
      notifyCustomer: true,
      fragile: false
    }
  ];

  beforeEach(async () => {
    const templateServiceSpy = jasmine.createSpyObj('TemplateService', ['getAllTemplates'], {
      templates$: of(mockTemplates)
    });
    const executionPlanServiceSpy = jasmine.createSpyObj('ExecutionPlanService', ['createExecutionPlan']);
    executionPlanServiceSpy.createExecutionPlan.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [ExecutionPlanModalComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: TemplateService, useValue: templateServiceSpy },
        { provide: ExecutionPlanService, useValue: executionPlanServiceSpy }
      ]
    }).compileComponents();

    templateService = TestBed.inject(TemplateService) as jasmine.SpyObj<TemplateService>;
    executionPlanService = TestBed.inject(ExecutionPlanService) as jasmine.SpyObj<ExecutionPlanService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.planForm.get('templateId')?.value).toBeNull();
    expect(component.planForm.valid).toBeFalse();
  });

  it('should initialize with empty selected shipments', () => {
    expect(component.selectedShipments).toEqual([]);
  });

  it('should have templates$ observable with mock data', async () => {
    const templates = await firstValueFrom(component.templates$);
    expect(templates).toEqual(mockTemplates);
  });

  it('should emit close event when onClose is called', () => {
    const closeSpy = spyOn(component.close, 'emit');
    component.onClose();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not create execution plan when form is invalid', () => {
    component.selectedShipments = mockShipments;
    component.createExecutionPlan();
    expect(executionPlanService.createExecutionPlan).not.toHaveBeenCalled();
  });

  it('should not create execution plan when no shipments are selected', () => {
    component.planForm.patchValue({ templateId: 1 });
    component.createExecutionPlan();
    expect(executionPlanService.createExecutionPlan).not.toHaveBeenCalled();
  });

  it('should create execution plan when form is valid and shipments are selected', () => {
    // Given
    component.selectedShipments = mockShipments;
    component.planForm.patchValue({ templateId: 1 });

    // When
    component.createExecutionPlan();

    // Then
    expect(executionPlanService.createExecutionPlan).toHaveBeenCalledWith(
      [mockShipments[0].id],
      1
    );
  });

  it('should emit planCreated and close events on successful plan creation', () => {
    // Given
    const planCreatedSpy = spyOn(component.planCreated, 'emit');
    const closeSpy = spyOn(component.close, 'emit');
    component.selectedShipments = mockShipments;
    component.planForm.patchValue({ templateId: 1 });

    // When
    component.createExecutionPlan();

    // Then
    expect(planCreatedSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
