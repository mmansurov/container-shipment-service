import { Component } from '@angular/core';
import { ExecutionPlanService } from '../../services/execution-plan.service';

@Component({
  selector: 'app-execution-plan',
  templateUrl: './execution-plan.component.html',
  styleUrls: ['./execution-plan.component.scss']
})
export class ExecutionPlanComponent {
  executionPlansState$ = this.executionPlanService.executionPlansState$;

  constructor(private executionPlanService: ExecutionPlanService) {
  }
}
