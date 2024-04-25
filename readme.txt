# Steps to deploy the api to K8 cluster

# 1.  Build the docker container for fastapi
docker build -t <dockerhub_username>/<image_name>:<tag> .
docker build -t myil/productsupportbackendapi:1.1 .

# 1.  Push the image to hub
docker push <dockerhub_username>/<image_name>:<tag>
docker push myil/productsupportbackendapi:1.1
          
# 2.  login into azure account
    a.  az login
    b.  https://www.youtube.com/watch?v=Q0Jqy3Jp65c
    c.  az account set -s <subscription id>  # when there are multiple subscriptions this is a must have


# 3.  connect to remote Azure kubernetest cluster
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
az aks get-credentials --resource-group productsupport_rg --name product_support_k8


# 4.  Create the deployment in cluster
kubectl apply -f ./k8/deployment.yaml

# 5.  Create service in cluster
kubectl apply -f ./k8/service.yaml

# 6.  To find the url for service
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
b.  az aks get-credentials --resource-group rg_productsupport --name aks_product_support_cluster


AI Models
a.  https://www.youtube.com/watch?v=C3-SkB1s9bs
b.  install Xcode from appstore for mac - this was a pain to find out
c.  RAG Explained:  https://www.youtube.com/watch?v=T-D1OfcDW1M
d.  RAG implementation:  https://medium.com/international-school-of-ai-data-science/implementing-rag-with-langchain-and-hugging-face-28e3ea66c5f7
e.  faiss-cpu has issues running with 3.12 and the suggestion on the net was to downgrade it to 3.9.x and it worked.
    https://github.com/pypa/pip/issues/988
f.




Key vaults
1.  https://www.youtube.com/watch?v=Vs3wyFk9upo  #create and access keyvault

Clear orphan docker images
1.  docker system prune -a --volumes

docker-compose down --rmi all --volumes