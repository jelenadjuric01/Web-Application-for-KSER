import express from 'express';
import { RegistrationController } from '../controlers/registration.controller';

const registrationRouter = express.Router();



registrationRouter.route('/fetchAll').get(
    (req, res) => new RegistrationController().fetchAll(req, res)
);

registrationRouter.route('/setOrg').post(
    (req, res) => new RegistrationController().setForOrganizers(req, res)
);

registrationRouter.route('/setPart').post(
    (req, res) => new RegistrationController().setForParticipants(req, res)
);

registrationRouter.route('/setFor').post(
    (req, res) => new RegistrationController().setForForeings(req, res)
);



export default registrationRouter;