---
layout: page
title: Building Custom Docker Image
permalink: /docker/node-app/
---
# Building a custom container to run your Custom App

In this example, we have a custom NodeJs app that we want to run in a container.

To build our own container image, we need to write a Dockerfile.

```Dockerfile
FROM node:12

ADD weather-app /weather-app

WORKDIR /weather-app

EXPOSE 3000

CMD ["node", "server.js"]
```

Breaking down the above `Dockerfile`

1. the `FROM` statement specifies a base image to use as a starting point
2. the `ADD` statement copies the directory `weather-app` from our current directory, into the container image
3. the `WORKDIR` statementsets the default working directory for all furture actions in the Dockerfile (and the default directory if gaining an interactive shell in the container)
4. the `RUN` statement defines a command to run in the container at build time
5. the `EXPOSE` statement configures port 3000 to be opened on this container
6. the `CMD` statement sets the default command that will run when the container starts

To build this container, navigate to the `node-app` directory, and run:

```bash
~$ docker build .
```

You will see when this command finishes that the container is given a Hash based ID. Since this isn't human friendly, you can tag container image builds in a more user friendly way. (Ie. Semantic Versioning)

```bash
~$ docker build -t node-app:1.0.0 .
```

To then run this container:

**Note:** To Run this follow the codeburst link in the [Refs](#refs) section and use the instructions their to make an account and API Key on [OpenWeatherMap.org](openweathermap.org)

```bash
~$ docker run -e API_KEY=$API_KEY -p 3000:3000 -d node-app:1.0.0
```

Previous: [Nginx Web Server](../nginx)

## Refs

* [https://docs.docker.com/engine/reference/builder/](https://docs.docker.com/engine/reference/builder/)  
* [https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b](https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b)
* [https://hub.docker.com/\_/node/](https://hub.docker.com/\_/node/)
