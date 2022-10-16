---
title: Docker-Compose
date: 2021-12-14 20:19:05
tags:
  - docker
  - vm
  - container
categories:
  - devops
---

![](https://res.cloudinary.com/faeshal/image/upload/v1665906694/faeshalcom/banner-dockercompose_n5iuds.jpg)

## Docker File

Before we talk about compose one thing should we know is Docker Fie . What is Docker File ? . A Dockerfile is file that Docker reads from top to bottom. It contains a bunch of instructions which informs Docker HowDocker image should get built. Short Answer Dockerfile basically for **Customize your Docker image** .

You can relate it to cooking. In cooking you have recipes. A recipe lets you know all of the steps you must take in order to produce whatever you’re trying to cook. Recipe = Docker FIle

## Docker File Command

```bash
    Commands:
      FROM              Must be the first , for set base image container
      EXPOSE            For exposing container PORT
      RUN               Execute any commands in a new layer on top of the current image   CMD               For Executing Container
      LABEL             instruction adds metadata to an image
      ENV               sets the environment variable to the value
      COPY              copies new files or directories from <src>
      ADD               copies new files too but ADD have little power than copy , ADD supports 2 other sources. URL & TAR files
      ENTRYPOINT        allows you to configure a container that will run as an executable
      VOLUME            Create Container Volume
      USER              Sets the user name (or UID) and optionally the user group (or GID)
      WORKDIR           Sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD instructions
      ARG               defines a variable that users can pass at build-time to the builder
      HEALTHCHECK       tells Docker how to test a container to check that it is still working
      SHELL             allows the default shell used for the shell form of commands to be overridden
      ONBUILD           adds to the image a trigger instruction to be executed at a later time, when the image is used as the base for another build.
      STOP SIGNAL       sets the system call signal that will be sent to the container to exit
```

## Create Docker FIle

Ok Let's Practice, for example we have a Use Case:

- you wanna build Node on top of Linux Alpine
- Expose port 4000
- Adding custom work directory to /app
- Adding tini for graceful shutdown before you running it.

## Answer :

```bash
    FROM node:10.17-alpine

    EXPOSE 4000

    RUN apk add --no-cache tini

    WORKDIR /app

    COPY package*.json ./

    RUN npm install && npm cache clean --force

    COPY . .

    ENTRYPOINT ["/sbin/tini", "--"]

    CMD ["node","app.js"]
```

After that you ready to build the docker file by run

- _**Docker build -t <tagname> .**_

Very Simple Right ? It is ! . That's why Developer & Operaion Team love Docker.

## Docker Compose 

What the heck is compose ?  If you wanna run multiple container at single service (in local environment) you need compose . Short Answer compose is YAML file for defining multi container such as port , shared volume , relation between container etc.

- **[YAML - Reference](https://blog.stackpath.com/yaml/)**

## Compose Command

Docker Compose CLICommands:

```bash
      build              Build or rebuild services
      bundle             Generate a Docker bundle from the Compose file
      config             Validate and view the Compose file
      create             Create services
      down               Stop and remove containers, networks, images, and volumes
      events             Receive real time events from containers
      exec               Execute a command in a running container
      help               Get help on a command
      images             List images
      kill               Kill containers
      logs               View output from containers
      pause              Pause services
      port               Print the public port for a port binding
      ps                 List containers
      pull               Pull service images
      push               Push service images
      restart            Restart services
      rm                 Remove stopped containers
      run                Run a one-off command
      scale              Set number of containers for a service
      start              Start services
      stop               Stop services
      top                Display the running processes
      unpause            Unpause services
      up                 Create and start containers
      version            Show the Docker-Compose version information
```

## Create Docker Compose

The most important things you need to know, you must write docker compose YAML version in first line , There are two version now . **Version 2 for local development** and **Version 3 if you using orchestration like kubernetes or swarm** . I recomend you using version 2 because have a lot of feature for local development.

- **[Docker Compose Version - Docs](https://docs.docker.com/compose/compose-file/compose-versioning/)**

Remember Docker Compose care about **Indentation** and case sensitive

Back To the create docker compose , for example we have use case :

- You have 2 services , first **app** service and second **mongo** services which is your database
- App services is build from docker file , so you no need to download image again.
- Expose your app to port **3000** & make sure node app run **after mongodb up and running**
- you need set MongoDB Volume too and expose mongo port to **27019**

## Answer : 

    version: '2.4'
    services:
      app:
        restart: always
        build: .
        ports:
          - '3000:3000'
        depends_on:
          - mongo
      mongo:
        image: mongo:4.2.0
        ports:
          - '27018:27017'
        volumes:
          - mloandata:/data/db
          - mloanconfig:/data/configdb
    volumes:
      mloandata:
      mloanconfig:

## Last Word

That's it about docker compose hope you will get better understanding about compose workflow, dont forget to check really good blog post about docker & compose , Link down below.

- **[Docker Compose - CheatSheet](https://jstobigdata.com/docker-compose-cheatsheet/)**
- **[Docker File - Reference](https://docs.docker.com/engine/reference/builder/)**
- **[Docker Compose - Reference](https://docs.docker.com/compose/)**
