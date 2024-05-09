docker build -t myil/productsupportbackendapi:1.2 .
docker push myil/productsupportbackendapi:1.2
kubectl apply -f ./k8/deployment.yaml
kubectl apply -f ./k8/service.yaml
minikube service productsupportbackendapp-service --url

