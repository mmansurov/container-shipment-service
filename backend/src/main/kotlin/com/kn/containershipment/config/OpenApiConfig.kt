package com.kn.containershipment.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.info.Contact
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun openAPI(): OpenAPI {
        return OpenAPI()
            .info(
                Info()
                    .title("Container Shipment Service API")
                    .description("REST API for managing shipments, templates, and execution plans")
                    .version("1.0")
                    .contact(
                        Contact()
                            .name("Container Shipment Team")
                    )
            )
    }
}
