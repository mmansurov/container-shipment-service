import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExecutionPlanComponent } from './execution-plan.component';
import { ExecutionPlanService } from '../../services/execution-plan.service';
import { of } from 'rxjs';

describe('ExecutionPlanComponent', () => {
  let component: ExecutionPlanComponent;
  let fixture: ComponentFixture<ExecutionPlanComponent>;
  let executionPlanService: jasmine.SpyObj<ExecutionPlanService>;

  beforeEach(async () => {
    const executionPlanServiceSpy = jasmine.createSpyObj('ExecutionPlanService', [], {
      executionPlans$: of([])
    });

    await TestBed.configureTestingModule({
      declarations: [ExecutionPlanComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ExecutionPlanService, useValue: executionPlanServiceSpy }
      ]
    }).compileComponents();

    executionPlanService = TestBed.inject(ExecutionPlanService) as jasmine.SpyObj<ExecutionPlanService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have executionPlans$ observable', () => {
    component.executionPlans$.subscribe(plans => {
      expect(plans).toEqual([]);
    });
  });
});
