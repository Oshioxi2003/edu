.PHONY: help install migrate run test clean docker-build docker-up docker-down shell superuser

help:
	@echo "Available commands:"
	@echo "  install        Install dependencies"
	@echo "  migrate        Run database migrations"
	@echo "  run            Run development server"
	@echo "  test           Run tests"
	@echo "  clean          Clean Python cache files"
	@echo "  docker-build   Build Docker images"
	@echo "  docker-up      Start Docker containers"
	@echo "  docker-down    Stop Docker containers"
	@echo "  shell          Open Django shell"
	@echo "  superuser      Create superuser"
	@echo "  celery         Run Celery worker"
	@echo "  beat           Run Celery beat"

install:
	pip install -r requirements/dev.txt

migrate:
	python manage.py migrate

makemigrations:
	python manage.py makemigrations

run:
	python manage.py runserver

test:
	pytest

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

shell:
	python manage.py shell

superuser:
	python manage.py createsuperuser

celery:
	celery -A config worker -l info

beat:
	celery -A config beat -l info

collectstatic:
	python manage.py collectstatic --noinput

seed:
	python manage.py seed_demo
