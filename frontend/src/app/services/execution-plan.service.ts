import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExecutionPlan } from '../models/execution-plan.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExecutionPlanService {
  private apiUrl = `${environment.apiUrl}/execution-plans`;
  private executionPlansSubject = new Subject<ExecutionPlan[]>();
  executionPlans$ = this.executionPlansSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadExecutionPlans();
  }

  loadExecutionPlans() {
    this.http.get<ExecutionPlan[]>(this.apiUrl).subscribe(
      plans => this.executionPlansSubject.next(plans)
    );
  }

  createExecutionPlan(shipmentIds: number[], templateId: number): Observable<ExecutionPlan> {
    return this.http.post<ExecutionPlan>(this.apiUrl, {shipmentIds, templateId}).pipe(
      tap(() => this.loadExecutionPlans())
    );
  }
}
