# Server install

You will need an instance of [Jdemetra-ws](https://github.com/nbbrd/jdemetra-ws) running to use this client. To install it locally, you will find some instructions in [gettingstarted](https://github.com/nbbrd/jdemetra-ws/blob/master/doc/gettingstarted.md). Here are some further instructions from a non `java` developer point of view, if it can be of any help.

## Add the `repositories` entry to `pom.xml`:

```xml
<repositories>
  <repository>
    <id>joinup-snapshots</id>
    <url>https://joinup.ec.europa.eu/nexus/content/repositories/snapshots/</url>
    <releases>
        <enabled>false</enabled>
    </releases>
    <snapshots>
        <enabled>true</enabled>
    </snapshots>
  </repository>
  <repository>
    <id>joinup-releases</id>
    <url>https://joinup.ec.europa.eu/nexus/content/repositories/releases/</url>
    <releases>
        <enabled>true</enabled>
    </releases>
    <snapshots>
        <enabled>false</enabled>
    </snapshots>
  </repository>
</repositories>
```

## Add CORS headers

To make the client work, the header `Access-Control-Allow-Origin` should be set in the server responses (`*` makes things easy for during local tests).

We didn't manage to add CORS headers with the instructions given in `doc/gettingstarted.md`. It might be because this kind of filter only works within Tomcat and we use the `standalone` version of the application. So instead, we added a filter with for [jersey](https://github.com/FranckCo/CSPA-SA/blob/07dd97906b849734614f65335bd40f5e0bd7a9eb/src/main/java/fr/insee/cspa/sa/config/CorsFilter.java).

More precisely, we added the following file `/ws-commons/src/main/java/ec/nbb/ws/filters/CorsFilter.java`:

```java
package ec.nbb.ws.filters;

import java.io.IOException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.MultivaluedMap;

/**
 * CORS Filter 
 * */
public class CorsFilter implements ContainerResponseFilter {
	
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
 
        MultivaluedMap<String, Object> headers = responseContext.getHeaders();
        headers.add("Access-Control-Allow-Origin", "*");        
        headers.add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");            
        headers.add("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    }
 
}
```

We used this filter by adding it in the `Main.java` file for the standalone application:

```java
public class Main {

  ...

  public static HttpServer startServer(int port) {

      final ResourceConfig rc = new ResourceConfig()
              .packages("ec.nbb.demetra.rest")
              ...
              .register(ec.nbb.ws.filters.CorsFilter.class);
```

## Package the application (skip tests)

One test does not pass but the application is working. So to run the application:

```
mvn package -D skipTests
```

## Launch the application

`java -jar ./demetra-webapp-standalone/target/webapp-standalone-0.0.1.jar`

and navigate to `http://localhost:9998/demetra/api` (see command output for the exact URL).