import { Router } from 'express';
import multer from 'multer';

import configMulter from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';
import canProviderMiddleware from './app/middlewares/canProvider';

const routes = new Router();
const upload = multer(configMulter);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/schedules', canProviderMiddleware, ScheduleController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);

routes.get(
  '/notifications',
  canProviderMiddleware,
  NotificationController.index
);

routes.get('/providers', ProviderController.index);

routes.put('/users', UserController.update);

export default routes;
