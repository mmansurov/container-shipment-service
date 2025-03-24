import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ShipmentListComponent } from './components/shipment-list/shipment-list.component';
import { ExecutionPlanModalComponent } from './components/execution-plan-modal/execution-plan-modal.component';
import { ExecutionPlanComponent } from './components/execution-plan/execution-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    ShipmentListComponent,
    ExecutionPlanModalComponent,
    ExecutionPlanComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
