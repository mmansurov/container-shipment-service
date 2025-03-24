package com.kn.containershipment.controller.api

import com.kn.containershipment.controller.dto.ExecutionPlanCreateDto
import com.kn.containershipment.controller.dto.ExecutionPlanDto
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@Tag(name = "Execution Plan", description = "Execution Plan management APIs")
@RequestMapping("/api/execution-plans")
interface ExecutionPlanResource {

    @Operation(
        summary = "Get all execution plans",
        description = "Retrieves a list of all execution plans"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved the list of execution plans"
    )
    @GetMapping
    fun getAllExecutionPlans(): ResponseEntity<List<ExecutionPlanDto>>

    @Operation(
        summary = "Create execution plan",
        description = "Creates new execution plans by combining shipment ids with a template"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully created execution plans"
    )
    @ApiResponse(
        responseCode = "404",
        description = "Shipment or template not found"
    )
    @PostMapping
    fun createExecutionPlan(
        @Parameter(description = "Request body containing shipment and template IDs")
        @RequestBody request: ExecutionPlanCreateDto
    ): ResponseEntity<Unit>
}
