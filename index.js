import low from '0http/lib/server/low'
import cero from '0http'
import createRouter from 'find-my-way'
import router from './src/router'


const port = process.env.PORT || 3000

const { server, router } = cero({ 
  server: low(),
  router
})

server.listen(port, (socket) => {
  if (socket) {
    console.log('HTTP server ready!')
  }
})

router.on('GET', '/github', (req, res, params, store) => {
  res.end('Hello World!')
})

server.close()