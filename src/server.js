import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
/*
    - HTTP
        - Method
        - Url
    
    - Methods
        - GET => Get a resource at back-end.
        - POST => Create a resource at back-end.
        - PUT => Update a resource at back-end.
        - PATCH => Update a specific data from a resource at back-end.
        - DELETE => Delete a resource at back-end.

    - States
        - Stateful => States are saved on memory.
        - Stateless => States are saved on HD.

    - Headers (Request/Response)
        - Metadata
    
    - Status Code

    - Data
        - Query Parameters: URL Stateful => Filters, pagination, optional
        - Route Parameters: Identify resource
        - Request Body: Send data (HTTPS) => Forms
*/

const server = http.createServer(async (request, response) => {
    const { method, url } = request

    await json(request, response)

    const route = routes.find(route => {
        return route.method == method
               && route.path.test(url)
    })

    if (route) {
        const routeParams = request.url.match(route.path)
        const { query,...params } = routeParams.groups

        request.query = query ? extractQueryParams(query) : {}
        request.params = params

        return route.handler(request, response)
    }

    return response.writeHead(404).end()
})


server.listen(3333)