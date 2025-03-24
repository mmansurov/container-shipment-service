package com.kn.containershipment.controller.dto

data class ExecutionPlanCreateDto(
    val shipmentIds: List<Long>,
    val templateId: Long
)
