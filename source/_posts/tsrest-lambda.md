title: Proper API Deployment with AWS Serverless Lambda
date: 2023-11-29 13:42:08
tags:

- backend
- serverless
- aws

---

![](https://i.postimg.cc/C1rrWb02/serverless.jpg)

## Intro

According to [IBM](https://www.ibm.com/topics/serverless), Serverless is a cloud application development and execution model that lets developers build and run code without managing servers, and without paying for idle cloud infrastructure

In the simplest terms, serverless computing is a way to run code without worrying about servers. You just make sure your code works, upload it and you're done. Let cloud provider in this case AWS take care the rest. Sound good ? it is.

Advantages of serverless computing include:

- Cost
  You'll only pay for what you use. In some other cloud-based models, you'll reserve space (whether you use it or not).
- Flexibility.
  Serverless models scale without your intervention.
- Accuracy.
  Developers can focus on a specific function rather than worrying about the back-end architecture that supports that action. This separation of powers could allow for cleaner code.
- Speed.
  Developers don't need to waste time worrying about estimating and allocating server space.

## Architecture

Our focus this time is deployment, not how to create the rest api. Today we gonna deploy Typescript REST API on top of AWS Cloud using serverless function with this kind of architecure.

![](https://i.postimg.cc/QVZMJ9FB/aws-lambda-diagram-1.jpg)

The tech stack that we are using are:

- Express Typescript Rest API ([Github Repo](https://))
- [AWS Lambda](https://https://aws.amazon.com/lambda/)
- [API Gateway](https://aws.amazon.com/api-gateway/)
- [RDS (MySQL Server)](https://aws.amazon.com/rds/)
- [Parameter Store](https://https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) (environment variable storage & cheap alternative for secret manager)

## 1. Setup VPC

- search vpc

![](https://i.postimg.cc/L8VcxYJc/Screenshot-2023-11-30-at-5-08-32-PM.png)

- click on button create, go to vpc & more to set the subnet simultaneously

![](https://i.postimg.cc/Y0w8cRVb/Screenshot-2023-11-20-at-2-23-08-PM.png)

- fill up the form with your need, in this example i wanna create vpc with spec:

  - 2 subnet on 2 AZ (minimum recomendation)
  - 2 private subnet & 2 public subnet
  - 1 nat gateway
  - 1 internet gateway

![](https://i.postimg.cc/q7Sjw4Gf/Screenshot-2023-11-20-at-2-22-54-PM.png)

- then click create vpc button & wait the loading

![](https://i.postimg.cc/RFtGbyPW/Screenshot-2023-11-20-at-2-25-48-PM.png)

- after that you can see the result by clicking view vpc

![](https://i.postimg.cc/90tbcTHV/Screenshot-2023-11-20-at-2-26-23-PM.png)

- you can see your subnet already create too

![](https://i.postimg.cc/BZxM5WLy/Screenshot-2023-11-20-at-2-26-31-PM.png)

- go to security group tab, create new one for lambda, set outbound http & https so lambda can access outside private subnet later

![](https://i.postimg.cc/BQppyxCB/Screenshot-2023-11-20-at-4-51-35-PM.png)

- the final look for security group is like this. You have 2 security group (faeshal-vpc & lambda) inside your custom vpc.

![](https://i.postimg.cc/WbTSX904/Screenshot-2023-11-20-at-4-51-17-PM.png)

## 2. Setup Lambda

- search lambda
- click create function button
- choose author from stratch

![](https://i.postimg.cc/4N92SKS8/Screenshot-2023-11-20-at-2-33-56-PM.png)

- fill up basic info, type function name, runtime nodejs 20 etc.
- dropdown the advance setting & place lambda inside our VPC & private subnet which we create before.

![](https://i.postimg.cc/JzCYVrwR/Screenshot-2023-11-20-at-2-34-11-PM.png)

- after that click create function.

![](https://i.postimg.cc/FFqnpbDd/Screenshot-2023-11-20-at-2-37-50-PM.png)

- don't forget to give lambda permission for accessing SSM parameter store later then we ready to go.

![](https://i.postimg.cc/x1sskKJ1/lambda-param-store.png)

## 3. Setup API Gateway

- search api gateway
- scroll down on rest api section, then click build
- choose rest api protocol & leave the rest default setting then click create api.

![](https://i.postimg.cc/QtC0kV7J/Screenshot-2023-11-20-at-2-40-20-PM.png)

- after that click action, choose click resource and tick on configure as proxy resource like this & save.

![](https://i.postimg.cc/hv7s6wpJ/Screenshot-2023-11-20-at-2-41-06-PM.png)

- click action again, click deploy api, name it "prod", then click deploy. finish.

![](https://i.postimg.cc/Y9P8XkfK/Screenshot-2023-11-20-at-2-41-20-PM.png)

- now lambda have a trigger from API Gateway.

![](https://i.postimg.cc/yNvLZ0DN/Screenshot-2023-11-20-at-2-41-49-PM.png)

## 4. Setup RDS

### Create RDS Instance

- search RDS
- click create database
- fill up form setting according to your needs, i'm using MySQL free tier for this time

![](https://i.postimg.cc/wvF5PzXT/Screenshot-2023-11-20-at-2-44-29-PM.png)

![](https://i.postimg.cc/FRhgDzJB/Screenshot-2023-11-20-at-2-43-49-PM.png)

- the important part is just like lambda, dont forget to place RDS on our vpc that create before & use private subnet (don't use public subnet, for security best practices)

![](https://i.postimg.cc/ZnRPzQHP/Screenshot-2023-11-20-at-5-01-01-PM.png)

- click create database, wait loading until finish.

![](https://i.postimg.cc/JhD9MT6L/rds-finish.png)

### Setup RDS Proxy

- on the rds section, scroll down until you see connected compute resource, than click setup lambda connection

![](https://i.postimg.cc/7L8NJmPD/Screenshot-2023-11-20-at-5-15-29-PM.png)

- fill the form, select our lambda function as a target, create proxy & wait creation process

![](https://i.postimg.cc/QdWbMR30/Screenshot-2023-11-20-at-5-16-10-PM.png)

![](https://i.postimg.cc/T1Y0Y1dD/Screenshot-2023-11-20-at-5-27-31-PM.png)

- after that, final RDS summary config will look like this

![](https://i.postimg.cc/XqH8ZWqD/rds-finish-with-proxy.png)

## 4. AWS Parameter Store

- search parameter store
- click create parameter, fill up name & description
- on type section, choose secure string, paste your database credential with comma separation
- leave rest as default setting
- then click create parameter

![](https://i.postimg.cc/7Ynt4vq7/Screenshot-2023-11-20-at-5-37-13-PM.png)

## 5. Setup CI/CD Github Action

![](https://i.postimg.cc/JnsS7pp8/Screenshot-2023-11-29-at-8-15-00-PM.png)

- go to github repo -> setting & secrets & variables -> action
- on the secret tabs, create new repository secret & type your secret like this
- after that make sure main.yaml exist on the .github/workflows folders. That file basically contain instruction for github action to build, test & deploy to lambda.

```
name: Deploy
on:
push:
branches: - main

jobs:
deploy:
runs-on: ubuntu-latest
steps: - name: Checkout Code
uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Move node_modules to dist
        run: mv node_modules dist/node_modules

      - name: Zip
        run: (cd dist && zip -r ../function.zip .)

      - name: Deploy to AWS
        uses: appleboy/lambda-action@master
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: ${{ secrets.REGION }}
          function_name: ${{ secrets.FUNCTION_NAME }}
          zip_file: function.zip
```

- Done. Now, everytime you push commit to repo (main branch), action will trigger & ci/cd will running.

![](https://i.postimg.cc/W1jRm61m/job.png)

## Testing

if your config corect, you can directly try accessing lambda via postman / the web. If you dont know the url, go back to lambda dashboard on tab configurations->triggers, the url Dont forget to add /prod before the main api route.

![](https://i.postimg.cc/SKvtPWkv/Screenshot-2023-11-20-at-3-07-35-PM.png)

![](https://i.postimg.cc/xCNFVcdT/Screenshot-2023-11-20-at-3-27-08-PM.png)

you can make a test too from lambda dashboard like this. Focus on coding, let AWS handle the Infra. That's the beauty of Serverless.

![](https://i.postimg.cc/44tF87MW/test.png)
