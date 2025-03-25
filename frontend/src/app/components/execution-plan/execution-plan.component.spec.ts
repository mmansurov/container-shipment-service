import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExecutionPlanComponent } from './execution-plan.component';
import { ExecutionPlanService } from '../../services/execution-plan.service';
import { BehaviorSubject } from 'rxjs';
import { LoadingState } from '../../models/loading-state.model';
import { ExecutionPlan } from '../../models/execution-plan.model';
import { TransportType } from '../../models/transport-type.model';

describe('ExecutionPlanComponent', () => {
  let component: ExecutionPlanComponent;
  let fixture: ComponentFixture<ExecutionPlanComponent>;
  let executionPlanService: jasmine.SpyObj<ExecutionPlanService>;
  let stateSubject: BehaviorSubject<LoadingState<ExecutionPlan>>;

  const initialState: LoadingState<ExecutionPlan> = {
    data: [],
    loading: true
  };

  beforeEach(async () => {
    stateSubject = new BehaviorSubject<LoadingState<ExecutionPlan>>(initialState);
    
    const executionPlanServiceSpy = jasmine.createSpyObj('ExecutionPlanService', [], {
      executionPlansState$: stateSubject.asObservable()
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

  it('should handle loading state', (done) => {
    component.executionPlansState$.subscribe(state => {
      expect(state.loading).toBe(true);
      expect(state.data).toEqual([]);
      done();
    });
  });

  it('should display data when loaded', (done) => {
    const mockPlan: ExecutionPlan = {
      id: 1,
      origin: 'Hamburg',
      destination: 'Rotterdam',
      notifyCustomer: true,
      transportType: TransportType.SEA,
      fragile: false
    };

    const loadedState: LoadingState<ExecutionPlan> = {
      data: [mockPlan],
      loading: false
    };

    stateSubject.next(loadedState);
    fixture.detectChanges();

    component.executionPlansState$.subscribe(state => {
      expect(state.loading).toBe(false);
      expect(state.data.length).toBe(1);
      expect(state.data[0].origin).toBe('Hamburg');
      done();
    });
  });
});
