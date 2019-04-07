import express from 'express';
import { departmentRouter } from './resources/department';
import { userRouter } from './resources/user/user.router';
import { employeeRouter } from './resources/employee/employee.router';

export const restRouter = express.Router();
restRouter.use('/departments', departmentRouter);
restRouter.use('/users', userRouter);
restRouter.use('/employees', employeeRouter);
