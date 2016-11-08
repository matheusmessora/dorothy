# Dorothy

Dorothy provides a better way to visualize your Eureka services.
Dorothy magically turn this:

![Eureka dashboard](https://s3.amazonaws.com/doesuanota.com.br/img/Screen+Shot+2016-11-08+at+12.46.25+PM.png)

into this:

![Dorothy magic dashboard](https://s3.amazonaws.com/doesuanota.com.br/img/Screen+Shot+2016-11-08+at+12.40.18+PM.png)

## How to use it


### as a Container

```
docker run --name dorothy -e MONGO_PORT_27017_TCP_ADDR=localhost EUREKA_HOST=your_eureka-domain -e SERVICES=APP01,APP02,APP04,APP05 -d matheusmessora/dorothy
```

## Environment Variables

```
MONGO_PORT_27017_TCP_ADDR
```
This variable is **mandatory** and specifies the host that will be used to connect to MongoDB.
This variable will be set automatically if you use Docker Compose with [links](https://docs.docker.com/compose/compose-file/#/links) feature.

```
EUREKA_HOST
```
This variable is **mandatory** and specifies the host that will be used to call the Eurea REST API.

```
SERVICES
```
This variable is optional and is responsible for showing alerts when the services are not availables.


## Contribute
You are invited to contribute new features, fixes, or updates, large or small; we are always thrilled to receive pull requests, and do our best to process them as fast as we can.

Before you start to code, we recommend discussing your plans through a [GitHub issue](http://github.com/matheusmessora/dorothy) , especially for more ambitious contributions. This gives other contributors a chance to point you in the right direction, give you feedback on your design, and help you find out if someone else is working on the same thing.
