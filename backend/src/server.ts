import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routers/user.router';
import countryRouter from './routers/country.router';
import registrationRouter from './routers/registration.router';
import packageRouter from './routers/package.router';
import agendaRouter from './routers/agenda.router';
import mapRouter from './routers/map.router';
import newsRouter from './routers/news.router';
import notificationRouter from './routers/notification.router';

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/kser');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('mongo ok')
});

const router = express.Router();
router.use('/users', userRouter);
router.use('/country', countryRouter);
router.use('/registration', registrationRouter);
router.use('/package', packageRouter);
router.use('/agenda', agendaRouter);
router.use('/map', mapRouter);
router.use('/news', newsRouter);
router.use('/notifications', notificationRouter);


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));

