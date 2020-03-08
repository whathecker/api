# API for hellochokchok.com

This application is API that powers hellochokchok.com and its backoffice.

###### Prerequisite run application locally:

1. install rabbitmq
```
brew install rabbitmq
```
2. if you don't have node.js and npm installed locally, run following command
```
brew install node
```

###### Steps to run application locally:
```
npm install
rabbitmq-server
npm run localstart
```

###### Deployment Step:
- docker build . -t {IMAGE_NAME}
or 
- docker build . -t {IMAGE_NAME} (optional for PROD: -f Dockerfile.production)
- ensure Dockerrun.aws.json use correct docker image repository (prod or non-prod)
- aws ecr get-login --no-include-email --region eu-west-3 (authentication to ECR: https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth)
- docker push {ECR_REGISTRY_URL} (https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)
- eb deploy {APPLICATION_NAME}
