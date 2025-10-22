import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRoutes from './routes/RoutesUsuario';
import dadosRoutes from './routes/RoutesDados';
import avisoRoutes from './routes/RoutesAviso'
import { initializeDatabase } from './config/init';
import {createDatabaseIfNotExists} from './config/create'

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use('/api/usuario', usersRoutes);
    this.app.use('/dados',dadosRoutes);
    this.app.use('/avisos',avisoRoutes)
    
    // this.app.get('/health', (req: Request, res: Response) => {
    //   res.json({ 
    //     status: 'OK', 
    //     message: 'API está funcionando!',
    //     timestamp: new Date().toISOString()
    //   });
    // });

    // this.app.get('/', (req: Request, res: Response) => {
    //   res.json({ 
    //     message: 'Bem-vindo à API com TypeScript!',
    //     endpoints: {
    //       users: '/api/usuario',
    //       health: '/health'
    //     }
    //   });
    // });
  }

  private initializeErrorHandling(): void {
    // Error handling middleware
    this.app.use((err: any, req: Request, res: Response, next: Function) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Algo deu errado!' });
    });

    // 404 handler
    this.app.use(/.*/, (req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

  }

 public async start(): Promise<void> {
  try {
    await createDatabaseIfNotExists();
    await initializeDatabase();
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor TypeScript rodando na porta ${this.port}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Falha na inicialização da aplicação:', error);
  }
}
}

const server = new Server();
server.start();

