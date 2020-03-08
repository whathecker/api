# API for hellochokchok.com

This application is API that powers hellochokchok.com and its backoffice.

To run application locally

```
rabbitmq-server
```

DEPLOYMENT STEP:
- docker build . -t {IMAGE_NAME}
or 
- docker build . -t {IMAGE_NAME} (optional for PROD: -f Dockerfile.production)
- ensure Dockerrun.aws.json use correct docker image repository (prod or non-prod)
- aws ecr get-login --no-include-email --region eu-west-3 (authentication to ECR: https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth)
- docker push {ECR_REGISTRY_URL} (https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)
- eb deploy {APPLICATION_NAME}
