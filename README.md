DEPLOYMENT STEP:
- docker build . 
or 
- docker build . -f Dockerfile.production  (when it's production)
- ensure Dockerrun.aws.json use correct docker image repository (prod or non-prod)

- push docker image to AWS ECR: https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
- aws ecr get-login --no-include-email --region eu-west-3 (authentication to ECR)
https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html#registry_auth
