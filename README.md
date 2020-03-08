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
```
docker build . -t {IMAGE_NAME}
```
or for production build, run following
```
docker build . -t {IMAGE_NAME} -f Dockerfile.production)
```

ensure Dockerrun.aws.json use correct docker image repository (prod or non-prod)
```
aws ecr get-login --no-include-email --region eu-west-3
```
Read more about [authentication to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth)
```
docker push {YOUR_ECR_REGISTRY_URL}
```
Read more from AWS documentation about [pushing docker img to ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)

finally
```
eb deploy {YOUR_APPLICATION_NAME}
```
