## Project Structure
This is a multi-module Maven project consisting of:
- `backend` - Kotlin/Spring Boot service
- `frontend` - Angular application

## Design Decisions

### Execution Plan Creation
The task's requirement to create execution plans automatically when receiving shipments from RabbitMQ was interpreted as being specific to backend-only candidates.  
For this full-stack implementation, a different approach was chosen:
- Execution plans are created through the frontend interface
- This aligns better with full-stack requirements where user interaction is expected

## Quick Start

The project uses Maven's frontend-maven-plugin `com.github.eirslett` to automatically build and start the frontend along with the backend.  
To start the entire application, simply run:

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8080/api
- RabbitMQ Management: http://localhost:15672 (kn/kn)
- Full API documentation: http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432 (db: shipmentdb, user: postgres, password: postgres)

## TODO Improvements

- Add integration tests for:
  - REST Controllers, including @ExceptionHandlers logic
  - RabbitMQ Listener
- Add pagination for data tables
- Add request validation and better error messages
- Implement retry mechanism for failed RabbitMQ messages using Spring Retry
- Add logging and monitoring
- Implement caching for templates (rarely change, frequently accessed)
- Use database migrations (Flyway/Liquibase)
