package com.kn.containershipment.model

import jakarta.persistence.*

@Entity
@Table(name = "shipment")
data class Shipment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val origin: String? = null,

    val destination: String? = null,

    val customerId: String? = null,

    val createdDate: Long = 0,

    val fragile: Boolean = false,

    val notifyCustomer: Boolean = false,

    @Enumerated(EnumType.STRING)
    val transportType: TransportType? = null,

    @ManyToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "temperature_range_id")
    val temperatureRange: TemperatureRange? = null
)

enum class TransportType {
    AIR,
    SEA,
    ROAD
}

@Entity
@Table(name = "temperature_range")
data class TemperatureRange(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val min: Int = 0,
    val max: Int = 0
)
