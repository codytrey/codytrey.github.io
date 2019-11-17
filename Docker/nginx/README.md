# Nginx Container - Real World (ish) Example

> "Cool story bro, anyone can do a hello world. But what about real world applications"

First, make a directory named `www` in your current directory (ie: `mkdir www`) and then download [index.html](./www/index.html) and place it in that directory.

Now, let's run an Nginx web server, exposing port 8080 and mounting "$(pwd)/www" into the container as the web root

```bash
    ~$ docker run -p 8080:80 -v $(pwd)/www:/usr/share/nginx/html:ro -d nginx
```

Now open a web browser, and go to: `http://<yourhostname>:8080/`

Previous: [Hello World](../hello-world) Next: [Building Custom Containers](../node-app)

## Refs

* [https://hub.docker.com/_/nginx](https://hub.docker.com/_/nginx)
