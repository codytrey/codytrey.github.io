---
layout: page
title: Setting up a Docker and K8s test machine
permalink: /other/lab-machine/
---
# Setting up the lab environment

(*for future replication*)

| OS | Version |
| -- | ------- |
| Ubuntu | 19.04 |

## Base OS and Account setup

```bash
sudo adduser labuser
sudo apt-get update
sudo apt-get upgrade
```

## Docker setup

```bash
sudo apt install docker.io
cat <<EOF >> /etc/docker/daemon.json
{
"bip": "10.0.0.1/16",
"insecure-registries" : ["localhost:32000"]
}
EOF
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker cbelcher
```

## Kubernetes Setup (using microk8s)

```bash
sudo snap install microk8s --classic
sudo usermod -a -G microk8s labuser
microk8s.status --wait-ready
sudo snap alias microk8s.kubectl kubectl
microk8s.enable dns
microk8s.enable metrics-server
microk8s.enable storage
microk8s.enable helm
sudo snap alias microk8s.helm helm
helm init
```
