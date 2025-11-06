import { Router, Request, Response } from 'express';
import { dadosControllers } from '../controllers/dadosControllers';
import database from '../config/database';


const router = Router();

router.get('/',dadosControllers.getAllDados);
router.get('/:id',dadosControllers.getAllDadosById);
// 🔹 Nova rota para inserção automática dos dados
router.post('/', async (req: Request, res: Response) => {
  try {
    const { temperatura, id_laboratorio } = req.body;

    // Validação básica
    if (temperatura === undefined || id_laboratorio === undefined) {
      res.status(400).json({ error: 'Temperatura e ID do laboratório são obrigatórios' });
      return;
    }

    const result = await database.query(
      'INSERT INTO dados_coletados (temperatura, id_laboratorio) VALUES ($1, $2) RETURNING *',
      [temperatura, id_laboratorio]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router