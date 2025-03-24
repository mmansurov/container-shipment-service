package com.kn.containershipment.service

import com.kn.containershipment.model.PlanTemplate

interface TemplateService {
    fun getAllTemplates(): List<PlanTemplate>
    fun getTemplateById(id: Long): PlanTemplate?
}
