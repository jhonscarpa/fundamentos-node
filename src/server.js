import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

/**
 * Query Params URL stateful => filtros, paginação, etc.. /user?userId=1&name=Jhonatan
 * Route Params identificação de recurso /user/1
 * Request Body Envio de informações de um formulário (https)
 */

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })
  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3333)
console.log('Server running at http://localhost:3333 🚀🚀')
