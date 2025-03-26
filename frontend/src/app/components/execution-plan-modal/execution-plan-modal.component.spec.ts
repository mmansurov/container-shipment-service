import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ExecutionPlanModalComponent } from './execution-plan-modal.component';
import { TemplateService } from '../../services/template.service';
import { Shipment } from '../../models/shipment.model';
import { Template } from '../../models/template.model';
import { By } from '@angular/platform-browser';

describe('ExecutionPlanModalComponent', () => {
  let component: ExecutionPlanModalComponent;
  let fixture: ComponentFixture<ExecutionPlanModalComponent>;
  let templateService: jasmine.SpyObj<TemplateService>;

  const mockTemplates: Template[] = [
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' }
  ];

  const mockShipments: Shipment[] = [
    { id: 1, origin: 'A', destination: 'B' } as Shipment,
    { id: 2, origin: 'C', destination: 'D' } as Shipment
  ];

  beforeEach(async () => {
    templateService = jasmine.createSpyObj('TemplateService', [], {
      templates$: of(mockTemplates)
    });

    await TestBed.configureTestingModule({
      declarations: [ ExecutionPlanModalComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: TemplateService, useValue: templateService }
      ]
    }).compileComponents();

    templateService = TestBed.inject(TemplateService) as jasmine.SpyObj<TemplateService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with templateId control', () => {
      expect(component.planForm.get('templateId')).toBeTruthy();
      expect(component.planForm.get('templateId')?.validator).toBeTruthy();
    });

    it('should load templates on init', () => {
      let templates: Template[] = [];
      component.templates$.subscribe(t => templates = t);
      expect(templates).toEqual(mockTemplates);
    });
  });

  describe('Button State', () => {
    it('should disable create button when form is invalid', () => {
      component.selectedShipments = mockShipments;
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('button.btn-primary'));
      expect(button.nativeElement.disabled).toBeTrue();
      
      component.planForm.patchValue({ templateId: 1 });
      fixture.detectChanges();
      expect(button.nativeElement.disabled).toBeFalse();
    });

    it('should disable create button when no shipments are selected', () => {
      component.selectedShipments = [];
      component.planForm.patchValue({ templateId: 1 });
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('button.btn-primary'));
      expect(button.nativeElement.disabled).toBeTrue();
    });

    it('should disable create button when buttonDisabled is true', () => {
      component.selectedShipments = mockShipments;
      component.planForm.patchValue({ templateId: 1 });
      component.buttonDisabled = true;
      fixture.detectChanges();
      
      const button = fixture.debugElement.query(By.css('button.btn-primary'));
      expect(button.nativeElement.disabled).toBeTrue();
    });
  });

  describe('Button Text and Spinner', () => {
    it('should show loading spinner when buttonDisabled is true', () => {
      component.buttonDisabled = true;
      fixture.detectChanges();
      
      const spinner = fixture.debugElement.query(By.css('.spinner-border'));
      const loadingText = fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.textContent;
      
      expect(spinner).toBeTruthy();
      expect(loadingText.trim()).toBe('Loading...');
    });

    it('should show "Create Plan" text when buttonDisabled is false', () => {
      component.buttonDisabled = false;
      fixture.detectChanges();
      
      const spinner = fixture.debugElement.query(By.css('.spinner-border'));
      const buttonText = fixture.debugElement.query(By.css('button.btn-primary')).nativeElement.textContent;
      
      expect(spinner).toBeFalsy();
      expect(buttonText.trim()).toBe('Create Plan');
    });
  });

  describe('Events', () => {
    it('should emit createPlanRequested with correct data when form is submitted', () => {
      const createPlanSpy = spyOn(component.createPlanRequested, 'emit');
      component.selectedShipments = mockShipments;
      component.planForm.patchValue({ templateId: 1 });
      
      component.createExecutionPlan();
      
      expect(createPlanSpy).toHaveBeenCalledWith({
        templateId: 1,
        shipmentIds: [1, 2]
      });
    });

    it('should emit close event when onClose is called', () => {
      const closeSpy = spyOn(component.close, 'emit');
      component.onClose();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
