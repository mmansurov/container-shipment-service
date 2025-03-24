package com.kn.containershipment.service

import com.kn.containershipment.controller.dto.ExecutionPlanCreateDto
import com.kn.containershipment.controller.dto.ExecutionPlanDto

interface ExecutionPlanService {
    fun getAllExecutionPlans(): List<ExecutionPlanDto>
    fun createExecutionPlan(request: ExecutionPlanCreateDto)
}
