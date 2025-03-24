package com.kn.containershipment.controller

import com.kn.containershipment.controller.api.ShipmentResource
import com.kn.containershipment.model.Shipment
import com.kn.containershipment.service.ShipmentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
class ShipmentController(
    private val shipmentService: ShipmentService
) : ShipmentResource {

    override fun getAllShipments(): ResponseEntity<List<Shipment>> =
        ResponseEntity.ok(shipmentService.getAllShipments())
}
