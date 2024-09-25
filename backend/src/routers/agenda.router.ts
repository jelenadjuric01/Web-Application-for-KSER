import express from 'express';
import { AgendaController } from '../controlers/agenda.controller';

const agendaRouter = express.Router();

agendaRouter.route('/updateAgenda').post(
    (req, res) => new AgendaController().updateAgenda(req, res)
);

agendaRouter.route('/fetchAll').get(
    (req, res) => new AgendaController().fetchAll(req, res)
);





export default agendaRouter;