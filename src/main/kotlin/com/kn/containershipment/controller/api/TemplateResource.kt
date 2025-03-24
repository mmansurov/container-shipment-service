package com.kn.containershipment.controller.api

import com.kn.containershipment.model.PlanTemplate
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Tag(name = "Template", description = "Template management APIs")
@RequestMapping("/api/templates")
interface TemplateResource {

    @Operation(
        summary = "Get all templates",
        description = "Retrieves a list of all available execution plan templates"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Successfully retrieved the list of templates"
    )
    @GetMapping
    fun getAllTemplates(): ResponseEntity<List<PlanTemplate>>
}
