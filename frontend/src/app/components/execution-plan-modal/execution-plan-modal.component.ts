import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Shipment } from '../../models/shipment.model';
import { TemplateService } from '../../services/template.service';
import { ExecutionPlanService } from '../../services/execution-plan.service';

interface Template {
  id: number;
  name: string;
}

@Component({
  selector: 'app-execution-plan-modal',
  templateUrl: './execution-plan-modal.component.html',
  styleUrls: ['./execution-plan-modal.component.scss']
})
export class ExecutionPlanModalComponent implements OnInit, OnDestroy {
  @Input() selectedShipments: Shipment[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() planCreated = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  readonly templates$: Observable<Template[]> = this.templateService.templates$;
  planForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly templateService: TemplateService,
    private readonly executionPlanService: ExecutionPlanService
  ) {
    this.planForm = this.fb.group({
      templateId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.planForm.reset();
  }

  createExecutionPlan(): void {
    if (this.planForm.valid && this.selectedShipments.length > 0) {
      const templateId = this.planForm.get('templateId')?.value;
      const shipmentIds = this.selectedShipments.map(shipment => shipment.id);
      
      this.executionPlanService.createExecutionPlan(shipmentIds, templateId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.planCreated.emit();
            this.onClose();
          }
        });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
