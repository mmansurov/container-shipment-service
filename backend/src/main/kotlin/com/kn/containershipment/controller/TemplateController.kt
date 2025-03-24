package com.kn.containershipment.controller

import com.kn.containershipment.controller.api.TemplateResource
import com.kn.containershipment.model.PlanTemplate
import com.kn.containershipment.service.TemplateService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController

@RestController
class TemplateController(
    private val templateService: TemplateService
) : TemplateResource {

    override fun getAllTemplates(): ResponseEntity<List<PlanTemplate>> =
        ResponseEntity.ok(templateService.getAllTemplates())
}
