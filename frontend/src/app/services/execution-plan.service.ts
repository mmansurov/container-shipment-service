import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, exhaustMap, Observable, Subject } from 'rxjs';
import { CreateExecutionPlanRequest, ExecutionPlan } from '../models/execution-plan.model';
import { environment } from '../../environments/environment';
import { LoadingState } from '../models/loading-state.model';

@Injectable({
  providedIn: 'root'
})
export class ExecutionPlanService {
  private apiUrl = `${environment.apiUrl}/execution-plans`;
  private executionPlansSubject = new BehaviorSubject<LoadingState<ExecutionPlan>>({data: [], loading: true});
  private createPlanRequestSubject = new Subject<CreateExecutionPlanRequest>();

  executionPlansState$: Observable<LoadingState<ExecutionPlan>> = this.executionPlansSubject.asObservable();
  planCreated$: Observable<ExecutionPlan> = this.createPlanRequestSubject.pipe(
    exhaustMap(request => this.http.post<ExecutionPlan>(this.apiUrl, request)),
  );

  constructor(private http: HttpClient) {
    this.loadExecutionPlans();
  }

  loadExecutionPlans() {
    this.http.get<ExecutionPlan[]>(this.apiUrl).subscribe(
      plans => this.executionPlansSubject.next({data: plans, loading: false}),
    );
  }

  createExecutionPlan(request: CreateExecutionPlanRequest): void {
    this.createPlanRequestSubject.next(request);
  }
}
