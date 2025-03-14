import Fastify from 'fastify'
import { App } from 'obsidian'
import { ClipperDoc, Service } from './service';
const fastify = Fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024 // 50MB
})

class Server {
  private app: App;
  private port = 8282;
  private service: Service;
  async start(app: App) {
    this.app = app
    this.service = new Service(app)
    fastify.post('/hook', async  (request, reply) => {
      const clipper = request.body as ClipperDoc

      await this.service.upsert(clipper)
      return {
        data: {
          vaultName: this.app.vault.getName()
        }
      }
    })
    try {
      await fastify.listen({
        port: this.port
      })
    } catch(error) {
      //
    }
  }
  close() {
    return fastify.close()
  }
  get isRunning() {
    return fastify.server.listening
  }
  async switchPort(port: number) {
    this.port = port
    await this.close()
    return fastify.listen({
      port
    })
  }
}

export const server = new Server()