package com.kn.containershipment.repository

import com.kn.containershipment.model.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TemplateRepository : JpaRepository<PlanTemplate, Long>

@Repository
interface ActionRepository : JpaRepository<Action, Long>

@Repository
interface TemperatureRangeRepository : JpaRepository<TemperatureRange, Long>

@Repository
interface ShipmentRepository : JpaRepository<Shipment, Long>

@Repository
interface ExecutionPlanRepository : JpaRepository<ExecutionPlan, Long>