import express from 'express';
import passport from 'passport';
import departmentController from './department.controller';
import { isRoot } from '../../middlewares/is-root';

export const departmentRouter = express.Router();
// 1.authenticated user can view all the department
// 2.an root(admin) can create, update, and delete department

const rootPolicy = [passport.authenticate('jwt', { session: false }), isRoot];
departmentRouter
  .route('/')
  .post(rootPolicy, departmentController.create)
  .get(passport.authenticate('jwt', { session: false }), departmentController.findAll);

  departmentRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), departmentController.findOne)
  .delete(rootPolicy, departmentController.delete)
  .put(rootPolicy, departmentController.update);
