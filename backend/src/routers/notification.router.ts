import express from 'express';
import {  NotificationController } from '../controlers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.route('/addNot').post(
    (req, res) => new NotificationController().addNotification(req, res)
);
notificationRouter.route('/deleteNot').post(
    (req, res) => new NotificationController().deleteNotification(req, res)
);
notificationRouter.route('/updateNot').post(
    (req, res) => new NotificationController().updateNotification(req, res)
);

notificationRouter.route('/fetchAll').get(
    (req, res) => new NotificationController().fetchAll(req, res)
);

notificationRouter.route('/fetchNot').post(
    (req, res) => new NotificationController().fetchNotification(req, res)
);




export default notificationRouter;