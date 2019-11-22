---
layout: page
title: Using k8s Deployments
permalink: /kubernetes/deployment/
---
# Using k8s Deployments

Great, the App is running and exposed. Time to call it a day right?

Consider what happens if we need to do any of the following:

* Update the application with:
  * a new container image
  * a new API key
* Change any k8s related settings

Would it be seemless to the end users?

No, the pod would have to be deleted before the new and updated version can deployed. Thus, creating downtime.

However, by using the deployment resouce type in k8s, when a change is made to the child pod, k8s knows to keep the old version running until the new version has become avaliable.

First, delete the pod from earlier:

```bash
~$ kubectl delete pod/node-app
```

Lets look at the first version of our deployment: [node-deploy-v1.yaml](./node-deploy-v1.yaml)

And then deploy it with:

```bash
~$ kubectl apply -f node-deploy-v1.yaml
```

let's view the created deployment resource by running:

```bash
~$ kubectl get deployment/node-app-deployment
# for more detail use describe instead of get
~$ kubectl describe deployment/node-app-deployment
# and we can see the child resources by running:
~$ kubectl get replicaset
~$ kubectl get pods
```

Now a *very* important update to the configuration. We need to specify a specific image version rather than defaulting to the latest image.

See the difference on [line 19 of node-deploy-v2.yaml](./node-deploy-v2.yaml#L19)]

And *apply* it with:

```bash
~$ kubectl apply -f node-deploy-v2.yaml
```

Take a look under the events section of `node-app-deployment`

```bash
~$ kubectl describe deployment/node-app-deployment
Name:                   node-app-deployment
Namespace:              default
...
Events:
  Type    Reason             Age    From                   Message
  ----    ------             ----   ----                   -------
  Normal  ScalingReplicaSet  2m32s  deployment-controller  Scaled up replica set node-app-deployment-7b5bf5b8c7 to 1
  Normal  ScalingReplicaSet  14s    deployment-controller  Scaled up replica set node-app-deployment-7d9b5b9c88 to 1
  Normal  ScalingReplicaSet  12s    deployment-controller  Scaled down replica set node-app-deployment-7b5bf5b8c7 to 0
```

See that a new replica set was scaled up **before** the old replica set was scaled down.

We can see the replica sets by doing:

```bash
~$ kubectl get replicaset
~$ kubectl describe replicaset/$(kubectl get replicaset --no-headers=true | head -n1 | cut -d " " -f 1)
~$ kubectl describe replicaset/$(kubectl get replicaset --no-headers=true | tail -n1 | cut -d " " -f 1)
```

Notice how the newer replica set has the `Created pod` message before the older replicaset has the `Deleted pod` message.

But why isn't the old replica set deleted as soon as the new one's pod is alive? (*hint: roll back*)
