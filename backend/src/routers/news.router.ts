import express from 'express';
import { NewsController } from '../controlers/news.controller';

const newsRouter = express.Router();

newsRouter.route('/addNews').post(
    (req, res) => new NewsController().addNews(req, res)
);
newsRouter.route('/deleteNews').post(
    (req, res) => new NewsController().deleteNews(req, res)
);
newsRouter.route('/updateNews').post(
    (req, res) => new NewsController().updateNews(req, res)
);

newsRouter.route('/fetchAll').get(
    (req, res) => new NewsController().fetchAll(req, res)
);

newsRouter.route('/fetchNews').post(
    (req, res) => new NewsController().fetchNews(req, res)
);




export default newsRouter;