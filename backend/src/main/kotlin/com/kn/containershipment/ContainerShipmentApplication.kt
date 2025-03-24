package com.kn.containershipment

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(scanBasePackages = ["com.kn.containershipment"])
class ContainerShipmentApplication

fun main(args: Array<String>) {
	runApplication<ContainerShipmentApplication>(*args)
}
