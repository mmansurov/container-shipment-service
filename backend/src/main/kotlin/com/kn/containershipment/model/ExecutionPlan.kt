package com.kn.containershipment.model

import jakarta.persistence.*

/**
 * ExecutionPlan is used to track execution of template actions for a shipment.
 */
@Entity
@Table(name = "execution_plan")
data class ExecutionPlan(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne
    @JoinColumn(name = "shipment_id")
    val shipment: Shipment? = null,

    @ManyToOne
    @JoinColumn(name = "template_id")
    val template: PlanTemplate? = null,

    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "execution_plan_id")
    val actions: List<ExecutionPlanAction> = listOf()
)

/**
 * ExecutionPlanAction represents a snapshot of a template action at the time of execution plan creation,
 * along with its execution status. This ensures that changes to the template don't affect in-progress plans
 * and maintains accurate historical records.
 */
@Entity
@Table(name = "execution_plan_action")
data class ExecutionPlanAction(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    // Snapshot of the template action data
    val actionId: Long = 0,
    val actionName: String? = null,

    // Execution status
    val isExecuted: Boolean = false,
    val isNotify: Boolean = false,

    // Audit fields
    val createdAt: Long = System.currentTimeMillis()
)
