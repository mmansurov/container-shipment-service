package com.kn.containershipment.controller.api

import com.kn.containershipment.model.Shipment
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Tag(name = "Shipment", description = "Shipment management APIs")
@RequestMapping("/api/shipments")
interface ShipmentResource {

    @Operation(
        summary = "Get all shipments",
        description = "Retrieves a list of all shipments in the system"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved the list of shipments"
    )
    @GetMapping
    fun getAllShipments(): ResponseEntity<List<Shipment>>
}
