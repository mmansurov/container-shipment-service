package com.kn.containershipment.service.impl

import com.kn.containershipment.model.PlanTemplate
import com.kn.containershipment.repository.TemplateRepository
import com.kn.containershipment.service.TemplateService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TemplateServiceImpl(
    private val templateRepository: TemplateRepository
) : TemplateService {

    override fun getAllTemplates(): List<PlanTemplate> =
        templateRepository.findAll()

    override fun getTemplateById(id: Long): PlanTemplate? =
        templateRepository.findById(id).orElse(null)
}
