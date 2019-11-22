---
layout: page
title: Manage Kubernetes Deployments using Helm
permalink: /kubernetes/helm
---
# Manage Kubernetes Deployments using Helm

Now that you're familure with k8s concepts and resouces, you should learn about some tools that make it easier to manage deploying applications into k8s in a repeatable manner.

Helm describes itself as:

> The package manager for Kubernetes

[https://helm.sh/docs/](https://helm.sh/docs/)

Helm has a concept of a `chart`. A chart is esentially a collection of templated yaml files that define all of the resources nessisary to deploy an application into k8s. These files are then processes through a templating engine where the supplied values (see [values.yaml](./node-app/templates/values.yaml) for default values) are inserted into the templates.

This creates values yaml files that Helm deploys into Kubernetes for you.

**Note** if you haven't yet deleted the manually deployed resources, do so now by running:

```bash
kubectl delete -f ~/container_training/k8s/hpa/node-app-hpa.yaml
kubectl delete -f ~/container_training/k8s/hpa/node-deploy-v3.yaml
kubectl delete -f ~/container_training/k8s/service/node-svc.yaml
```

For this example we have created a sample chart that is able to reproduce the deployment we previous step by step.

Lets see what the generated yaml looks like if we pass no additional files:

```bash
~$ helm install ./node-app --dry-run --debug
```

The section under `COMPUTED VALUES` is all of the values that are being passed to the templating engine. As we haven't passed any non-default values, these will be all default values.

As you look under the `MANIFEST` section, you'll notice a few key differences between the generated yaml and our yaml from before:

* There are additional labels we didn't have
  * These are used for helm's internal version tracking of `releases`
* The `metadata.name` value is different.
  * This is because helm autogenerates a name in the form adjective-noun-chart-name unless the `-n` or `--name` flag is provided
* The service yaml was generated with spec.type=ClusterIP instead of NodePort
  * The default service type in a new helm chart is ClusterIP, which is fairly standard, however this can be changed in the template if the application deployed by the chart should default to a different type of service
* There is no hpa yaml generated
  * this is because we did not set the value hpa.enabled to true (the default is false)
  * the templating engine allows complex if/if else logic as well as loops to control when and how yaml is generated.

Let's set the options needed to replica our current deployed app.

```bash
~$ helm install ./node-app --name node-app --dry-run --debug --set service.type=NodePort,service.port=3000,hpa.enabled=true,hpa.metrics.type=Resource,hpa.metrics.resource.name=cpu,hpa.metrics.resource.target.type=Utilization,hpa.metrics.resource.target.averageUtilization=50,api.secretName=node-api-secret,api.secretKey=API_KEY
```

**Wow!** That command is gross, if you're wondering if there is a better way, you're in luck.

## Option 1.5

Using a values file when running helm install. With this option, each of the setting specified in the `--set` flag can be put in a yaml file that is then passed with a `-f` to `helm install`

Using the [values.yaml](./values.yaml) the following command is equivilent to previous gross command

```bash
~$ helm install ./node-app --name node-app --dry-run --debug -f values.yaml
```

## Option 2

A utility that is complementary to Helm is `Helmfile`. Helmfile is described as:

> Helm for your Helm

With helmfile, you write a [helmfile.yaml](./helmfile.yaml) that describes the release you want helm to create. This includes the release name, namespace, source chart, and any values to supply to helm.

Running the following command, from the directory that contains helmfile.yaml, is equivilent to the previous `helm install` comamnd:

```bash
helmfile sync
```
