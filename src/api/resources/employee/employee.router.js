import express from 'express';
import passport from 'passport';
import employeeController from './employee.controller';
import { isRoot } from '../../middlewares/is-root';

export const employeeRouter = express.Router();

// 1.an root(admin) can create, update, and delete employee
// const rootPolicy = [ isRoot];
employeeRouter
  .route('/')
  .get( employeeController.findAll)
  .post( employeeController.create);

employeeRouter.post('/login', employeeController.login);

employeeRouter
  .route('/:id')
  .get( employeeController.findOne)
  .put( employeeController.update);
