---
title: Deploy Golang on Linux Server with Nginx Reverse Proxy
date: 2022-08-12 21:09:56
tags:
  - golang
  - linux
  - nginx
categories:
  - devops
---

{% youtuber video 446E-r0rXHI %}{% endyoutuber %}

## Quick Intro 🪴

Deploying Golang supposed to be simple & straight forward, compare with other language like Java, PHP etc. I dont understand why a lot of article on the internet make it's looks very complicated & not straight to the point. So i write this note to give you some insight about how Golang deploy on top of Ubuntu Server with Nginx as Reverse Proxy + SSL HTTPS certificate.

## Deployment Step ✨

## Clone Project to Server 🌿

1. First step is pretty simple, just [SSH your linux server](https://www.linode.com/docs/guides/connect-to-server-over-ssh-on-linux/) with root access & move to **/var/www** directory. Clone your go project, like this:

```
git clone https://github.com/Faeshal/crowdfunding
```

2. As always dont forget to create & setup .env file, if you have it.

![env](https://i.postimg.cc/j5mLrcVt/Screen-Shot-2022-08-13-at-10-09-18-AM.png)

## Installing Golang on server 🍀

This is optional step, **you can deploy without installing Golang on the server** as long as you already build your Golang code, because remember what the server will run is native Golang binaries NOT raw Golang code (.go extension). But the recommended way is still installing Golang on the server so we can setup auto build CI/CD later.

1. go to **[Golang download page](https://go.dev/dl/)** to copy download link from linux OS section

![download2](https://i.postimg.cc/QxSw70QS/Screen-Shot-2022-08-12-at-9-15-48-PM.png)

2. go to your server again & move to directory **/usr/local** to download the file by typing:

```
wget https://go.dev/dl/go1.19.linux-amd64.tar.gz
```

🚧 **watch out the version!**. If you wanna install spesific Golang version be careful on that.

4. you can make sure the file was downloaded by typing "ls" & to extract the file just type:

```
tar -C /usr/local -xvf go1.19.linux-amd64.tar.gz
```

5. As you can see go folder will appear & if you want, you can delete go tar.gz that you download before.

![img2](https://i.postimg.cc/3Rdd66ct/Screen-Shot-2022-08-13-at-10-07-06-AM.png)

6. Setup GO PATH, so when you type "go" on server terminal, linux will recognize your command.

```
nano ~/.bashrc
```

7. do not care about other texts. Just focus on the last line. You need to add the path on the last line, save it & exit.

```
export PATH=$PATH:/usr/local/go/bin
```

![exp](https://i.postimg.cc/8P8jKZBb/Screen-Shot-2022-08-13-at-10-13-56-AM.png)

8. refresh it by typing:

```
source ~/.bashrc
```

9. done, you can check be typing "go version". Linux will recognize the command.

![go](https://i.postimg.cc/wTH0KQ9h/Screen-Shot-2022-08-13-at-1-49-38-PM.png)

10. after that move to your Golang project for build your GO app by typing **"go build -o app-name"** for example i will name it "funding-server".

```
go build -o funding-server
```

11. to run the program, very simple just type:

```
./funding-server
```

![build](https://i.postimg.cc/vHD3hHhn/Screen-Shot-2022-08-13-at-11-32-49-AM.png)

## Creating Linux Systemd Service 🥬

Systemd is a service manager for Linux operating systems. We need it for managing our Golang app that we already build, so when our server is restart or crash for example and the server is up again, our Golang app will run automatically. The step is pretty easy:

1. move to directory **/etc/systemd/system** & create service file based on your Golang app name.

```
touch funding-server.service
nano /etc/systemd/system/funding-server.service
```

![img](https://i.postimg.cc/0yzShzKY/Screen-Shot-2022-08-13-at-12-03-39-PM.png)

2. copy this code, make sure you give correct ExecStart path based on your Golang **build executable**. Dont forget to save & exit.

```
[Unit]
Description=Golang REST-API server for funding system
After=multi-user.target

[Service]
User=root
Group=root
ExecStart=/var/www/crowdfunding/funding-server

[Install]
WantedBy=multi-user.target
```

3. run & enable the service

```
systemctl start funding-server.service
systemctl enable funding-server.service
```

4. done, to check the service status type

```
systemctl status funding-server.service
```

![done](https://i.postimg.cc/3xZM5wMw/Screen-Shot-2022-08-13-at-1-35-22-PM.png)

5. until this step, basically you can access your Golang app by typing **server-ip:port**, because i set 7070 for my app, so the result is:

![port](https://i.postimg.cc/P5Tc4kLn/Screen-Shot-2022-08-13-at-1-38-48-PM.png)

but this is not a good & secure way. We need to hide the port & put Golang behind a Reverse Proxy. That's why we need **[NGINX](https://www.Nginx.com/)** to do that.

## Setup Nginx as Reverse Proxy 🌵

A reverse proxy is an application that typically sits between firewall & backend service. Nginx is one of the best reverse proxy in town. It will directing requests to the appropriate backend. Reverse proxies are typically implemented to increase security, performance, and reliability 🥇

Btw, i already have domain from **[Domainesia](https://www.domainesia.com/)** & for this app i will pointing to subdomain **go.faeshal.com**. Dont forget to add "A record" on your domain provider dashboard & fill it with your server IP.
![dns](https://i.postimg.cc/k5XgLZpk/Screen-Shot-2022-08-13-at-3-49-08-PM.png)

1. install Nginx

```
apt-get install Nginx
```

2. copy default Nginx setting, just in case

```
sudo cp /etc/Nginx/sites-available/default /etc/Nginx/sites-available/go.faeshal.com
```

3. create config file. Remember because we use proxy pass, you must comment listen port 80. Enter valid root path based on project directory, server name based on your domain & proxy pass based on your app port. Dont forget to save the config.

![config](https://i.postimg.cc/Nfg7CGxD/Screen-Shot-2022-08-13-at-2-03-17-PM.png)

4. restart & check Nginx configuration, if you fail on this step don't continue. Just check your Nginx configuration again, maybe there is a typo.

```
service Nginx restart
nginx -t
```

![img](https://i.postimg.cc/022DdW8H/Screen-Shot-2022-08-13-at-2-13-10-PM.png)

5. done, now Golang is run behind Nginx, but we need one last thing. Setup SSL so we can have Https connection.

![img](https://i.postimg.cc/L4k3Vgjh/Screen-Shot-2022-08-13-at-2-05-26-PM.png)

## Setup SSL HTTPS 🔰

HTTPS is the secure version of HTTP, which is the primary protocol used to send data & it's encrypted in order to increase security of data transfer.

1. we gonna using **[certbot](https://certbot.eff.org/)**, a package that handle all ssl stuf, very simple to install just type:

```
apt-get install certbot
apt-get install python3-certbot-Nginx
```

2. target to our domain name

```
sudo certbot --Nginx -d go.faeshal.com
```

3. auto renew https

```
certbot renew --dry-run
```

4. done, we got https connection. Very simple isn't it ?

![](https://i.postimg.cc/SQVzs6WL/Screen-Shot-2022-08-13-at-2-29-53-PM.png)

Hope this basic Golang deployment useful, many things that you can improved, such as adding firewall or adding caching mechanism. Anyway stay safe & stay secure, peace out 🖐️
