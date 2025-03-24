package com.kn.containershipment.controller.dto

import com.kn.containershipment.model.TransportType

data class ExecutionPlanDto(
    val id: Long = 0,
    val origin: String? = null,
    val destination: String? = null,
    val notifyCustomer: Boolean = false,
    val transportType: TransportType? = null,
    val fragile: Boolean = false
)
