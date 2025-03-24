package com.kn.containershipment.exception

class InvalidShipmentDataException(message: String) : RuntimeException(message)
class MessageProcessingException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
