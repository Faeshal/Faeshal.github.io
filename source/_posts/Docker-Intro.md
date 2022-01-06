---
title: Docker Intro
date: 2021-12-14 18:30:30
tags:
  - docker
  - vm
  - container
categories:
  - devops
---

{% youtuber video Gjnup-PuquQ %}{% endyoutuber %}
Docker is a tool to make it easier for create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.

Remember, Docker is different with virtual machine. This Architecture will show you the differences

## Traditional Virtual Machine

![](https://i.postimg.cc/q736rwWy/traditional.png)

## Docker Architecture

![](https://i.postimg.cc/FHqkw8Ch/container.png)

## Basic Command

First of all you must install docker desktop before you open the terminal , docker official documentation give you very clear step to do that .

- **[Download Docker](https://docs.docker.com/docker-for-windows/install/)**

Basically docker has a ton of command , but this is just the basic and probably usually you will using.

```bash
    #check docker version
    docker --version

    #searh & pull Image from Docker Hub
    docker search <image name>
    docker pull <image name>

    #see the docker image list 
    docker images

    #run docker image
    #if you run docker images that means images will convert into a container
    docker run <image name>/<image id>
    docker run -d <image name> (automatic detach)
    docker run -it <image name> (running interactive terminal)

    #see the running container
    docker ps

    #see all container (stop & running container)
    docker ps -a

    #give container name
    #by default docker give random name for container you can change it
    docker run -d --name=<name for container you want> <container image>

    #create docker volume & see volume list
    docker volume create <volume name>
    docker volumes ls

    #set docker port
    #for example mongodb container
    #Left port is port inside container , and Right port is real port (outside container)
    docker run -d -p 27019:27017 mongo
    docker network ls

    #start & restart & execute container
    #command 'start' means you already have a cotainer before it's diferent with 'run' command
    docker start <container name>
    docker restart <cotainer name>

    #delete images & container
    #-f means force mode , it's not recommended but nice if you are in hurry
    docker rmi <image name/id>
    docker rmi -f <image name/id>
    docker rm <container name/id>

    #delete all images & container & volume & network
    docker image prune
    docker container prune
    docker volume prune
    docker network prune

    # Push image to Docker Hub
    docker login --username=yourhubusername (after execute, enter your hub password)
    docker push yourhubusername/containername
```

## Last Word

In the next series we will talk about docker file & docker compose , so dont forget to check docker documentation & i will give another article that speak better than me as always link down below .

- **[Docker - Official Docs](https://docs.docker.com/)**
- **[Docker Curriculum](https://docker-curriculum.com/)**
- **[Docker - Linuxize](https://linuxize.com/tags/docker/)**
