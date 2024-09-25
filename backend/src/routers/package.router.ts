import express from 'express';
import { PackageController } from '../controlers/package.controller';

const packageRouter = express.Router();

packageRouter.route('/updatePackage').post(
    (req, res) => new PackageController().updatePackage(req, res)
);

packageRouter.route('/fetchAll').get(
    (req, res) => new PackageController().fetchAll(req, res)
);





export default packageRouter;