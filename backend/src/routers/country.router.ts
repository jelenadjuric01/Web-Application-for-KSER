import express from 'express';
import { CountryController } from '../controlers/country.controller';

const countryRouter = express.Router();

countryRouter.route('/fetchByName').post(
    (req, res) => new CountryController().fetchByName(req, res)
);

countryRouter.route('/fetchAll').get(
    (req, res) => new CountryController().fetchAll(req, res)
);





export default countryRouter;