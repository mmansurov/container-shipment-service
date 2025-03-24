package com.kn.containershipment.service

import com.kn.containershipment.model.Shipment

interface ShipmentService {
    fun getAllShipments(): List<Shipment>
    fun saveShipment(shipment: Shipment): Shipment
    fun getShipmentById(id: Long): Shipment?
}
