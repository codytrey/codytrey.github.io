# Running a Pod in K8S

first look at the [node_pod.yaml](./node_pod.yaml) file. It describes the pod that we wish to deploy into our k8s cluster.

Notice that it references a secret, so that secret must be created:

```bash
~$ kubectl create secret generic node-api-secret --from-literal=API_KEY=$API_KEY
# to view the created secret
~$ kubectl describe secret/node-api-secret
```

Now deploy the pod by running:

```bash
~$ kubectl create -f node_pod.yaml
```
