import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not found!')
})

server.listen(3333)

// Query params
// http://localhost:3333/users?userId=1&name=Felipe
// Stateful URLs => Filtros, paginação, não-obrigatórios e não sensíveis

// Route params
// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1
// Identificação de recurso

// Request body
// POST http://localhost:3333/users
// Envio de informações de um formulário (https)
