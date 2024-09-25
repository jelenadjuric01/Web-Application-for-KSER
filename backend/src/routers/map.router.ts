import express from 'express';
import { MapController } from '../controlers/map.controller';

const mapRouter = express.Router();

mapRouter.route('/addMark').post(
    (req, res) => new MapController().addMark(req, res)
);

mapRouter.route('/deleteMark').post(
    (req, res) => new MapController().deleteMark(req, res)
);

mapRouter.route('/fetchAll').get(
    (req, res) => new MapController().fetchAll(req, res)
);





export default mapRouter;