import express from 'express';
import passport from 'passport';
import departmentController from './department.controller';
import { isRoot } from '../../middlewares/is-root';

export const departmentRouter = express.Router();
// 1.authenticated user can view all the department
// 2.an root(admin) can create, update, and delete department

// const rootPolicy = [isRoot];
departmentRouter
  .route('/')
  .post(departmentController.create)
  .get(departmentController.findAll);

departmentRouter
  .route('/:id')
  .get(departmentController.findOne)
  .delete(departmentController.delete)
  .put(departmentController.update);

departmentRouter.post('/deleteEmployee', departmentController.deleteEmployee);
