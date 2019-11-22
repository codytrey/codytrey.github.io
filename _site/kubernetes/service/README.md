# Expose the previus pod via a k8s service

View the file [node-svc.yaml](./node-svc.yaml)

Deploy it with:

```bash
~$ kubectl create -f node-svc.yaml
```

Then run the below command to get the URL where this is being exposed:

```bash
echo http://$HOSTNAME:$(kubectl get svc/node-app-svc -o jsonpath='{ .spec.ports[0].nodePort }')/
```
