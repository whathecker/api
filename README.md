# API for hellochokchok.com

This application is API that powers hellochokchok.com and its backoffice.



### Prerequisite run application locally:

1. install rabbitmq
```
brew install rabbitmq
```
2. install node.js and npm (in case you don't have it locally)
```
brew install node
```

3. have db configuration file in app/config folder of project
```
contact author
```



### Steps to run application locally:
```
npm install
rabbitmq-server
npm run localstart
```



### Deployment Step:

1. build docker image
```
docker build . -t {IMAGE_NAME}
```

  - or run following for PROD build
```
docker build . -t {IMAGE_NAME} -f Dockerfile.production)
```

2. Ensure Dockerrun.aws.json use correct docker image repository (prod or non-prod)


3. Authentication to AWS ECR
```
aws ecr get-login --no-include-email --region eu-west-3
```
Read more about [authentication to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth)


4. Push docker image to ECR
```
docker push {YOUR_ECR_REGISTRY_URL}
```
Read more from AWS documentation about [pushing docker img to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)


5. deploy build to eb instnace
```
eb deploy {YOUR_APPLICATION_NAME}
```
