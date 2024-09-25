import express from 'express';
import { UserController } from '../controlers/user.controller';

const userRouter = express.Router();

userRouter.route('/sendNotifications').post(
    (req, res) => new UserController().sendNotifications(req, res)
);

userRouter.route('/fetchByEmail').post(
    (req, res) => new UserController().fetchByEmail(req, res)
);

userRouter.route('/addUser').post(
    (req, res) => new UserController().addUser(req, res)
);

userRouter.route('/updateUser').post(
    (req, res) => new UserController().updateUser(req, res)
);

userRouter.route('/fetchAll').get(
    (req, res) => new UserController().fetchAll(req, res)
);

userRouter.route('/acceptUser').post(
    (req, res) => new UserController().acceptUser(req, res)
);

userRouter.route('/deleteUser').post(
    (req, res) => new UserController().deleteUser(req, res)
);

userRouter.route('/changeType').post(
    (req, res) => new UserController().changeType(req, res)
);

userRouter.route('/sendPassword').post(
    (req, res) => new UserController().sendPassword(req, res)
);

userRouter.route('/addRoommates').post(
    (req, res) => new UserController().addRoommates(req, res)
);



export default userRouter;