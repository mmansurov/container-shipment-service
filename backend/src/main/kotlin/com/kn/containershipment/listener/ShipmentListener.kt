package com.kn.containershipment.listener

import com.kn.containershipment.exception.InvalidShipmentDataException
import com.kn.containershipment.exception.MessageProcessingException
import com.kn.containershipment.model.Shipment
import com.kn.containershipment.model.TemperatureRange
import com.kn.containershipment.model.TransportType
import com.kn.containershipment.service.ShipmentService
import org.slf4j.LoggerFactory
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

data class TemperatureRangeMessage(
    val min: Int = 0,
    val max: Int = 0
)

data class ShipmentMessage(
    val shipmentId: Long = 0,
    val origin: String? = null,
    val destination: String? = null,
    val customerId: String? = null,
    val createdDate: Long = 0,
    val fragile: Boolean = false,
    val notifyCustomer: Boolean = false,
    val transportType: TransportType? = null,
    val temperature: TemperatureRangeMessage = TemperatureRangeMessage()
)

@Component
class ShipmentListener(private val shipmentService: ShipmentService) {

    private val logger = LoggerFactory.getLogger(javaClass)

    @RabbitListener(queues = ["shipment.queue"])
    fun handleShipment(message: ShipmentMessage) {
        logger.info("Received shipment message: $message")
        
        try {
            // Validate required fields
            if (message.origin.isNullOrBlank() || message.destination.isNullOrBlank() || message.customerId.isNullOrBlank()) {
                throw InvalidShipmentDataException("Required fields (origin, destination, customerId) cannot be null or empty")
            }
            
            val shipment = Shipment(
                id = message.shipmentId,
                origin = message.origin,
                destination = message.destination,
                customerId = message.customerId,
                createdDate = message.createdDate,
                fragile = message.fragile,
                notifyCustomer = message.notifyCustomer,
                transportType = message.transportType,
                temperatureRange = TemperatureRange(
                    min = message.temperature.min,
                    max = message.temperature.max
                )
            )
            
            val savedShipment = shipmentService.saveShipment(shipment)
            logger.info("Saved shipment with ID: ${savedShipment.id}")
        } catch (e: InvalidShipmentDataException) {
            logger.error("Invalid shipment data: ${e.message}")
            throw e
        } catch (e: Exception) {
            logger.error("Error processing shipment message: ${e.message}", e)
            throw MessageProcessingException("Failed to process shipment message", e)
        }
    }
}
