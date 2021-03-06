import request from 'supertest'
import server from './src/server'
import exec from './src/exec'


jest.mock('./src/exec')

describe('Service Tests', () => {
  const baseUrl = `http://localhost:${process.env.PORT}`

  beforeEach(() => {
    exec.mockResolvedValue()
  })

  it('should successfully register service routes', (done) => {
    server.listen(process.env.PORT, done)
  })

  it('should GET JSON response: /health', async () => {
    const resp = await request(baseUrl).get('/health')
    const json = JSON.parse(resp.text)

    expect(resp.status).toEqual(200)
    expect(json.data).toEqual('healthy')
  })

  it('should GET 404 response: /missing', async () => {
    const resp = await request(baseUrl).get('/missing')
    const json = JSON.parse(resp.text)

    expect(resp.status).toEqual(404)
    expect(json.data).toEqual('not found')
  })

  it('should GET 404 response: /bad/%url', async () => {
    const resp = await request(baseUrl).get('/bad/%url')
    const json = JSON.parse(resp.text)

    expect(resp.status).toEqual(404)
    expect(json.data).toEqual('not found')
  })

  it('should POST JSON: /github', async () => {
    const resp = await request(baseUrl)
      .post('/github')
      .send({ repository: { name: 'sample' }})

    const json = JSON.parse(resp.text)

    expect(resp.status).toEqual(200)
    expect(json.data).toEqual('success')
    expect(exec.mock.calls).toMatchSnapshot()
  })

  it('should successfully terminate the service', async () => {
    server.close()
  })
})