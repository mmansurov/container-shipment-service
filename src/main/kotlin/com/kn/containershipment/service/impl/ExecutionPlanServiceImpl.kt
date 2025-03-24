package com.kn.containershipment.service.impl

import com.kn.containershipment.controller.dto.ExecutionPlanCreateDto
import com.kn.containershipment.controller.dto.ExecutionPlanDto
import com.kn.containershipment.model.ExecutionPlan
import com.kn.containershipment.model.ExecutionPlanAction
import com.kn.containershipment.repository.ExecutionPlanRepository
import com.kn.containershipment.repository.ShipmentRepository
import com.kn.containershipment.repository.TemplateRepository
import com.kn.containershipment.service.ExecutionPlanService
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ExecutionPlanServiceImpl(
    private val templateRepository: TemplateRepository,
    private val shipmentRepository: ShipmentRepository,
    private val executionPlanRepository: ExecutionPlanRepository,
) : ExecutionPlanService {

    @Transactional(readOnly = true)
    override fun getAllExecutionPlans(): List<ExecutionPlanDto> {
        // TODO: page and size are hardcoded just for Assessment task
        // TODO: use jpa metamodel ExecutionPlan_.ID instead of hardcoded "id"
        val pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"))
        return executionPlanRepository.findAll(pageable)
            .content
            // TODO: move to MapStruct
            .map { executionPlan ->
                ExecutionPlanDto(
                    id = executionPlan.id,
                    origin = executionPlan.shipment?.origin,
                    destination = executionPlan.shipment?.destination ?: "",
                    notifyCustomer = executionPlan.shipment?.notifyCustomer ?: false,
                    transportType = executionPlan.shipment?.transportType,
                    fragile = executionPlan.shipment?.fragile ?: false
                )
            }
    }

    override fun createExecutionPlan(request: ExecutionPlanCreateDto) {
        val template = templateRepository.findById(request.templateId)
            .orElseThrow { EmptyResultDataAccessException("Template not found with id: ${request.templateId}", 1) }

        val executionPlans = request.shipmentIds.map { shipmentId ->
            ExecutionPlan(
                shipment = shipmentRepository.getReferenceById(shipmentId),
                template = template,
                actions = template.actions.map { action ->
                    ExecutionPlanAction(
                        actionId = action.id,
                        actionName = action.name,
                        isExecuted = false,
                        isNotify = false
                    )
                }
            )
        }

        executionPlanRepository.saveAll(executionPlans)
    }
}
