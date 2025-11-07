"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const RoutesUsuario_1 = __importDefault(require("./routes/RoutesUsuario"));
const RoutesDados_1 = __importDefault(require("./routes/RoutesDados"));
const RoutesAviso_1 = __importDefault(require("./routes/RoutesAviso"));
const RoutesAmostra_1 = __importDefault(require("./routes/RoutesAmostra"));
const init_1 = require("./config/init");
const create_1 = require("./config/create");
dotenv_1.default.config();
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '3011');
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    initializeRoutes() {
        this.app.use('/api/usuario', RoutesUsuario_1.default);
        this.app.use('/amostras', RoutesAmostra_1.default);
        this.app.use('/dados', RoutesDados_1.default);
        this.app.use('/avisos', RoutesAviso_1.default);
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
    initializeErrorHandling() {
        // Error handling middleware
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Algo deu errado!' });
        });
        // 404 handler
        this.app.use(/.*/, (req, res) => {
            res.status(404).json({ error: 'Rota não encontrada' });
        });
    }
    async start() {
        try {
            await (0, create_1.createDatabaseIfNotExists)();
            await (0, init_1.initializeDatabase)();
            this.app.listen(this.port, () => {
                console.log(`🚀 Servidor TypeScript rodando na porta ${this.port}`);
                console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            });
        }
        catch (error) {
            console.error('❌ Falha na inicialização da aplicação:', error);
        }
    }
}
const server = new Server();
server.start();
