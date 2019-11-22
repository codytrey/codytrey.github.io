---
layout: page
title: Scaling Applications in k8s
permalink: /kubernetes/hpa/
---
# Scaling Applications in k8s

Times are good. Our app is deployed in k8s, exposed to users, and updates don't impact avalibility. What more could anyone ask for?

Well turns out you're so good at your job, the app is getting 30 times the users this week than it was last week and performance is starting to suffer. How do we address this?

Fortunately, k8s has built in scaling for pods that are deployed via deployment/replicaset and will even distribute the traffic if exposed via a k8s service.

How do we scale? remember seeing the `replicas: 1` line in the deployment files from the previous section: [node-deploy-v2.yaml](../deployment/node-deploy-v2.yaml#L8)

We *could* update that value and run the `kubectl apply` again, but there is a better way.

We can tell k8s to scale the existing deployment by:

```bash
~$ kubectl get deployments
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
node-app-deployment   1/1     1            1           28m

~$ kubectl scale --replicas=3 deployment/node-app-deployment
deployment.apps/node-app-deployment scaled

~$ kubectl get deployments
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
node-app-deployment   3/3     3            3           29m

~$ kubectl get pods
NAME                                   READY   STATUS        RESTARTS   AGE
node-app-deployment-7d9b5b9c88-6wbgt   1/1     Running       0          86s
node-app-deployment-7d9b5b9c88-cgx9b   1/1     Running       0          28m
node-app-deployment-7d9b5b9c88-j6576   1/1     Running       0          86s
```

Notice how there are 2 new pods, and the existing pod remains, bringing the total to the desired 3.

What do you think will happen if you are accessing the app, and delete one of the pods.

Once you think you know, try it by running:

```bash
~$ kubectl delete --force=true --grace-period=0 pod/$(kubectl get pod --no-headers=true | shuf | head -n1 | cut -d " " -f1)
```

## Autoscaling

Scaling to a set number of pods is nice and easy, but what if the load is dynamic and you only want to scale out when needed? (ex: Large influx of traffic on a streaming site between 6:00 and 9:00 pm and on weekends, but 7:00 am to 4:00 pm on weekdays is usually very slow)

Kubernetes provides a resource called `Horizontal Pod Autoscaler`, or `HPA`. What an `HPA` does is look at the requested CPU and/or Memory of a pod (or custom metric) and compare that to the actual usage.

If the resource usage of a pod (or average of pods in replica set) exceeds the given threshold for longer than a set period of time, a scale up event is triggered.

If the resource usage of a pod (or average of pods in replica set) goes far enough below the threshold for long enough, a scale down event is triggered.

Notice that an HPA depends on us specifying how much CPU and/or Memory should requested by a pod.

In the [node-deploy-v3.yaml](./node-deploy-v3.yaml#L28-34) file, we have added CPU and memory requests and limits. (See the kubernetes documentation [here](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#resource-types) for more information on setting resource requests and limits)

We first need to apply this update by running:

```bash
~$ kubectl apply -f node-deploy-v3.yaml
```

Then we can add an HPA to the updated deployment by:

```bash
~$ kubectl autoscale deployment/node-app-deployment --cpu-percent=50 --min=1 --max=4

~$ kubectl get hpa
NAME                  REFERENCE                        TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
node-app-deployment   Deployment/node-app-deployment   0%/50%    1         4         1         5m
```

(*an artificial load can be generated to test the HPA by running a curl command in a loop*)

An alternative way of creating an HPA is to define one in a yaml file (ie. declaratively) which is better for automated and reproducable deployments.

Take a look at [node-app-hpa.yaml](./node-app-hpa.yaml), this this declarative equivalint to the imparative `kubeclt autoscale` command from before.
