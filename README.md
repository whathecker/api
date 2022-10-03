# API for hellochokchok.com

APIs that powers hellochokchok.com and its backoffice. 



### Prerequisite run application locally:

1. Install rabbitmq
```
brew install rabbitmq
```
2. Install node.js and npm (in case you don't have it locally)
```
brew install node
```
3. Install eb cli & aws cli

4. Include db config file in app/config folder of project (contact author for more detail)

5. Have .env file in source code (contact author for more detail)




### Steps to run application locally:
```
npm install
rabbitmq-server
npm run localstart
```



### Deployment Step:

1. Build docker image
```
docker build . -t {IMAGE_NAME}
```

  - or run following for PROD build
```
docker build . -t {IMAGE_NAME} -f Dockerfile.production)
```

2. Ensure Dockerrun.aws.json use correct docker image repository (prod or non-prod)


3. Authentication to AWS ECR: read more about [authentication to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth)
```
aws ecr get-login --no-include-email --region eu-west-3
```



4. Push docker image to ECR: read more from AWS documentation about [pushing docker img to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)
```
docker push {YOUR_ECR_REGISTRY_URL}
```



5. Deploy build to eb instnace
```
eb deploy {YOUR_APPLICATION_NAME}
```
