# Steps to deploy the api to K8 cluster

# 1.  Build the docker container for fastapi
docker build -t <dockerhub_username>/<image_name>:<tag> .
docker build -t myil/productsupportbackendapi:1.1 .

# 1.  Push the image to hub
docker push <dockerhub_username>/<image_name>:<tag>
docker push myil/productsupportbackendapi:1.1

# 2.  Create the deployment in cluster
kubectl apply -f ./k8/deployment.yaml

# 3.  Create service in cluster
kubectl apply -f ./k8/service.yaml

# 4.  To find the url for service
minikube service myapp-service --url
minikube service productsupportbackendapp-service --url



NOTE: Other supporting commands are to be listed below
a.  minikube dashboard  # this command will open the k8 cluster's dashboard
b.  kubectl get svc --all-namespaces
c.  minikube ip
d.  kubectl get nodes -o wide
e.  kubectl  exec -it <podname> bash


Installing into Azure Kubeernetes cluster
a.  https://www.youtube.com/watch?v=Q0Jqy3Jp65c
b.  az account set -s <subscription id>  # when there are multiple subscriptions this is a must have
    az account set -s 0bd67bd4-ac53-46ec-8dbd-c8a657e723a9
b.  az aks get-credentials --resource-group rg_productsupport --name aks_product_support_cluster


AI Models
a.  https://www.youtube.com/watch?v=C3-SkB1s9bs
b.  install Xcode from appstore for mac - this was a pain to find out



Key vaults
1.  https://www.youtube.com/watch?v=Vs3wyFk9upo  #create and access keyvault