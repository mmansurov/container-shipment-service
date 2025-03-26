import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Shipment } from '../../models/shipment.model';
import { TemplateService } from '../../services/template.service';
import { Template } from '../../models/template.model';
import { CreateExecutionPlanRequest } from '../../models/execution-plan.model';

@Component({
  selector: 'app-execution-plan-modal',
  templateUrl: './execution-plan-modal.component.html',
  styleUrls: ['./execution-plan-modal.component.scss']
})
export class ExecutionPlanModalComponent implements OnInit {
  @Input() selectedShipments: Shipment[] = [];
  @Input() buttonDisabled = false;
  @Output() close = new EventEmitter<void>();
  @Output() createPlanRequested = new EventEmitter<CreateExecutionPlanRequest>();

  readonly templates$: Observable<Template[]> = this.templateService.templates$;
  readonly planForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly templateService: TemplateService,
  ) {
    this.planForm = this.fb.group({
      templateId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.planForm.reset();
  }

  createExecutionPlan() {
    if (this.planForm.valid && this.selectedShipments.length > 0) {
      const templateId = this.planForm.get('templateId')?.value;
      const shipmentIds = this.selectedShipments.map(shipment => shipment.id);
      this.createPlanRequested.emit({shipmentIds, templateId});
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
