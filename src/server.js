import http from 'node:http'
import { json } from './middlewares/json.js'
import { Database } from './middlewares/database.js'
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
*/

const database = new Database()

const server = http.createServer(async (request, response) => {
    const { method, url } = request

    await json(request, response)


    if (method === 'GET' && url === '/users') {
        const users = database.select('users')
        
        return response
            .end(JSON.stringify(users))
    }

    if (method === 'POST' && url === '/users') {
        const { name, email } = request.body
        
        const user = ({
            id: 1,
            name,
            email
        })

        database.insert('users', user)

        return response.writeHead(201).end()
    }
    
    return response.writeHead(404).end()
})


server.listen(3333)