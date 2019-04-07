import express from 'express';
import passport from 'passport';
import employeeController from './employee.controller';
import { isRoot } from '../../middlewares/is-root';

export const employeeRouter = express.Router();

// 1.an root(admin) can create, update, and delete employee
const rootPolicy = [passport.authenticate('jwt', { session: false }), isRoot];
employeeRouter
  .route('/')
  .post(rootPolicy, employeeController.create)
  .get(passport.authenticate('jwt', { session: false }), employeeController.findAll);
