package com.kn.containershipment.config

import org.springframework.amqp.core.*
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitConfig {
    companion object {
        const val EXCHANGE_NAME = "amq.fanout"
        const val QUEUE_NAME = "shipment.queue"
    }

    @Bean
    fun queue(): Queue = Queue(QUEUE_NAME, true)

    @Bean
    fun binding(queue: Queue, fanoutExchange: FanoutExchange): Binding =
        BindingBuilder.bind(queue).to(fanoutExchange)

    @Bean
    fun fanoutExchange(): FanoutExchange = FanoutExchange(EXCHANGE_NAME)

    @Bean
    fun messageConverter(): Jackson2JsonMessageConverter = Jackson2JsonMessageConverter()

    @Bean
    fun amqpTemplate(connectionFactory: ConnectionFactory): AmqpTemplate {
        val rabbitTemplate = RabbitTemplate(connectionFactory)
        rabbitTemplate.messageConverter = messageConverter()
        return rabbitTemplate
    }
}
