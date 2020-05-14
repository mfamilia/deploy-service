const createRouter = require('find-my-way')
const exec = require('./exec')

const router = createRouter({ 
  ignoreTrailingSlash: true,
  defaultRoute: (req, res) => {
    res.statusCode = 404
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ data: 'not found' }))
  }
})

router.on('GET', '/health', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ data: 'healthy' }))
})

const execCallback = (err, stdout, stderr) => {
  if(stdout) console.log(stdout)
  if(stderr) console.log(stderr)
}

router.on('POST', '/github', async (req, res) => {
  let body = [];

  await new Promise((resolve) => {
    req.on('data', (chunk) => {
      body.push(chunk);

    }).on('end', resolve)
  })

  const payload = JSON.parse(body)
  const { name } = payload.repository
  const dir = process.env.PROJECTS_DIR
  const path = `${dir}/${name}`

  await exec(`git -C ${path} reset --hard`, execCallback);
  await exec(`git -C ${path} clean -df`, execCallback);
  await exec(`git -C ${path} pull -f`, execCallback);
  await exec(`${path}/update.sh`, execCallback);
  
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ data: 'success' }))
});

module.exports = router