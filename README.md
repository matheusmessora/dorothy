# Dorothy

Dorothy provides a better way to visualize your Eureka services.

## How to use it


### as a Container

```
docker run --name dorothy -e EUREKA_HOST=your_eureka-domain -e SERVICES=APP01,APP02,APP04,APP05 -d matheusmessora/dorothy
```

#### Environment Variables

```
EUREKA_HOST
```
This variable is mandatory and specifies the host that will be used to call the Eurea REST API.

```
SERVICES
```
This variable is optional and is responsible for showing alerts when the services are not availables.


## Contribute
You are invited to contribute new features, fixes, or updates, large or small; we are always thrilled to receive pull requests, and do our best to process them as fast as we can.

Before you start to code, we recommend discussing your plans through a [GitHub issue](http://github.com/matheusmessora/dorothy) , especially for more ambitious contributions. This gives other contributors a chance to point you in the right direction, give you feedback on your design, and help you find out if someone else is working on the same thing.