---
title: Kubernetes Intro
date: 2022-01-09 12:42:24
tags:
  - container
  - docker
  - kubernetes
categories:
  - devops
---

{% youtuber video PziYflu8cB8 %}{% endyoutuber %}

## What is Kubernetes

Short answer Kubernetes is a Container Orchestrator. If we have a lot of containers on the server, we need a tool to manage all running containers, This is where Kubernetes comes in. This technology was created by Google and released as an open source project in 2014.

According to official docs, [kubernetes.io](https://kubernetes.io/) :

> Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation.

## Why need Kubernetes

When it comes to actually running containers in production, you can end up with dozens, **even thousands of containers over time**. These containers need to be deployed, managed, and connected and updated. If you were to do this manually, you’d need an entire team dedicated to this & very painful process.

It’s not enough to run containers, you need to be able to:

- Integrate and orchestrate these modular parts
- Scale up and scale down based on the demand
- Make them fault tolerant
- Provide communication across a cluster
- Self healing broken container

You might ask aren’t containers supposed to do all that? The answer is that containers are only a low-level piece of the puzzle. The real benefits are obtained with tools that sit on top of containers — like Kubernetes. These tools are today known as container orchestrator.

## Basic Terminology

There are a lot of terminology, but I'll list just a few, the most frequently mentioned.

- Kubernetes Cluster

  Set of nodes that run containerized applications + a master to manage them

- Node :

  virtual or a physical machine a.k.a server that will run our container

- Pod :

  The smallest, most basic deployable objects in Kubernetes. A Pod represents a single instance of a running process in your cluster. Pods contain one or more containers, such as Docker containers.

- Deployment :

  Monitor a set of pods and make sure they are running and restart if they crash

- Service

  Provider an easy to remember URL to access a running container

## Instalation Step

### For Linux

```
sudo apt-get update
```

```
sudo apt-get install -y apt-transport-https ca-certificates curl
```

```
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
```

```
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

```
sudo apt-get update
```

```
sudo apt-get install -y kubectl
```

verified kubernetes was running :

```
kubectl cluster-info
```

### For Windows & Mac

I highly recommended using [Docker Desktop](https://www.docker.com/products/docker-desktop) for windows & mac users because it's very easy to start kubernetes with that, you just go to setting and at the kubernetes section check the option of enable kubernetes, click apply & restart. That's it, ready to go.

![https://i.postimg.cc/RCpJ8x6Q/Screen-Shot-2022-01-09-at-1-11-33-PM.pngOther](https://i.postimg.cc/RCpJ8x6Q/Screen-Shot-2022-01-09-at-1-11-33-PM.png)

other instalation method: https://kubernetes.io/docs/tasks/tools/

## Basic Command

There are so many commands available, but at least this is what beginners will often use :

```
Nodes:
kubectl get no
kubectl get no -o wide

Pods:
kubectl get po
kubectl get po -o wide
kubectl describe po
kubectl get po –show-labels

Deployments:
kubectl get deploy
kubectl describe deploy

Services:
kubectl get svc
kubectl describe svc

Logs:
kubectl logs [pod_name]

Applly Config YAML:
kubectl apply -f [name_of _file_yaml]

basic Info:
kubectl config
kubectl cluster -info
```

more: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
