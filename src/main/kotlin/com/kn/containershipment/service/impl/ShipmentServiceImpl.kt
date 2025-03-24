package com.kn.containershipment.service.impl

import com.kn.containershipment.model.Shipment
import com.kn.containershipment.repository.ShipmentRepository
import com.kn.containershipment.service.ShipmentService
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class ShipmentServiceImpl(
    private val shipmentRepository: ShipmentRepository
) : ShipmentService {

    override fun getAllShipments(): List<Shipment> {
        // TODO: page and size are hardcoded just for Assessment task
        // TODO: use jpa metamodel Shipment_.ID instead of hardcoded "id"
        val pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"))
        return shipmentRepository.findAll(pageable).content
    }

    override fun saveShipment(shipment: Shipment): Shipment =
        shipmentRepository.save(shipment)

    override fun getShipmentById(id: Long): Shipment? =
        shipmentRepository.findById(id).orElse(null)
}
