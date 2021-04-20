PROJECT = backend_task

.PHONY: start
start:
	docker-compose -p $(PROJECT) up --build

.PHONY: logs
logs:
	docker-compose -p $(PROJECT) logs

.PHONY: restart
restart:
	docker-compose -p $(PROJECT) kill && \
	docker-compose -p $(PROJECT) rm -f && \
	docker-compose -p $(PROJECT) up --build

.PHONY: kill
kill:
	docker-compose -p $(PROJECT) kill

.PHONY: ps
ps:
	docker-compose -p $(PROJECT) ps

.PHONY: down
down:
	docker-compose -p $(PROJECT) down
