package com.kn.containershipment.service.impl

import com.kn.containershipment.controller.dto.ExecutionPlanCreateDto
import com.kn.containershipment.model.*
import com.kn.containershipment.repository.ExecutionPlanRepository
import com.kn.containershipment.repository.ShipmentRepository
import com.kn.containershipment.repository.TemplateRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import java.util.Optional

@ExtendWith(MockitoExtension::class)
class ExecutionPlanServiceImplTest {

    @Mock
    private lateinit var templateRepository: TemplateRepository

    @Mock
    private lateinit var shipmentRepository: ShipmentRepository

    @Mock
    private lateinit var executionPlanRepository: ExecutionPlanRepository

    private lateinit var executionPlanService: ExecutionPlanServiceImpl

    @BeforeEach
    fun setUp() {
        executionPlanService = ExecutionPlanServiceImpl(
            templateRepository,
            shipmentRepository,
            executionPlanRepository
        )
    }

    @Test
    fun `getAllExecutionPlans should return list of execution plan DTOs`() {
        // Given
        val shipment = Shipment(
            id = 1L,
            origin = "Origin",
            destination = "Destination",
            notifyCustomer = true,
            transportType = TransportType.AIR,
            fragile = true
        )
        
        val executionPlan = ExecutionPlan(
            id = 1L,
            shipment = shipment,
            template = PlanTemplate(id = 1L),
            actions = emptyList()
        )

        val pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"))
        val page = PageImpl(listOf(executionPlan))
        `when`(executionPlanRepository.findAll(pageable)).thenReturn(page)

        // When
        val result = executionPlanService.getAllExecutionPlans()

        // Then
        assertEquals(1, result.size)
        with(result[0]) {
            assertEquals(1L, id)
            assertEquals("Origin", origin)
            assertEquals("Destination", destination)
            assertTrue(notifyCustomer)
            assertEquals(TransportType.AIR, transportType)
            assertTrue(fragile)
        }
        verify(executionPlanRepository).findAll(pageable)
    }

    @Test
    fun `createExecutionPlan should create execution plans for given shipments`() {
        // Given
        val templateId = 1L
        val shipmentIds = listOf(1L, 2L)
        val request = ExecutionPlanCreateDto(shipmentIds, templateId)

        val templateAction = Action(id = 1L, name = "Action 1")
        val template = PlanTemplate(
            id = templateId,
            actions = mutableListOf(templateAction)
        )

        val shipment1 = Shipment(id = 1L)
        val shipment2 = Shipment(id = 2L)

        `when`(templateRepository.findById(templateId)).thenReturn(Optional.of(template))
        `when`(shipmentRepository.getReferenceById(1L)).thenReturn(shipment1)
        `when`(shipmentRepository.getReferenceById(2L)).thenReturn(shipment2)

        // When
        executionPlanService.createExecutionPlan(request)

        // Then
        verify(templateRepository).findById(templateId)
        verify(shipmentRepository).getReferenceById(1L)
        verify(shipmentRepository).getReferenceById(2L)
        
        val expectedExecutionPlans = shipmentIds.map { shipmentId ->
            ExecutionPlan(
                shipment = if (shipmentId == 1L) shipment1 else shipment2,
                template = template,
                actions = listOf(
                    ExecutionPlanAction(
                        actionId = templateAction.id,
                        actionName = templateAction.name,
                        isExecuted = false,
                        isNotify = false
                    )
                )
            )
        }
        verify(executionPlanRepository).saveAll(expectedExecutionPlans)
    }

    @Test
    fun `createExecutionPlan should throw exception when template not found`() {
        // Given
        val templateId = 1L
        val request = ExecutionPlanCreateDto(listOf(1L), templateId)
        `when`(templateRepository.findById(templateId)).thenReturn(Optional.empty())

        // When/Then
        assertThrows(EmptyResultDataAccessException::class.java) {
            executionPlanService.createExecutionPlan(request)
        }
        verify(templateRepository).findById(templateId)
        verifyNoInteractions(shipmentRepository, executionPlanRepository)
    }
}
