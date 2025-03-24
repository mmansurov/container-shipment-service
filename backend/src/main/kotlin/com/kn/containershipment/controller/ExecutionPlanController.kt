package com.kn.containershipment.controller

import com.kn.containershipment.controller.api.ExecutionPlanResource
import com.kn.containershipment.controller.dto.ExecutionPlanCreateDto
import com.kn.containershipment.controller.dto.ExecutionPlanDto
import com.kn.containershipment.service.ExecutionPlanService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
class ExecutionPlanController(
    private val executionPlanService: ExecutionPlanService
) : ExecutionPlanResource {

    override fun getAllExecutionPlans(): ResponseEntity<List<ExecutionPlanDto>> =
        ResponseEntity.ok(executionPlanService.getAllExecutionPlans())

    override fun createExecutionPlan(request: ExecutionPlanCreateDto): ResponseEntity<Unit> =
        ResponseEntity.ok(executionPlanService.createExecutionPlan(request))
}
