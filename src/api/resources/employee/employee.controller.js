import employeeService from './employee.service';
import Employee from './employee.model';
import Department from './../department/department.model';
import Joi from 'joi';
import jwt from '../../helpers/jwt';

export default {
  async create(req, res) {
    try {
      const { value, error } = employeeService.validateBody(req.body);
      if (error && error.details) {
        return res.json(error);
      }
      const userId = "5cb88052680db419aa9d59b0";
      value.user_create = userId;
      const randomPassword = Math.floor(100000 + Math.random() * 900000);
      console.log(randomPassword);
      value.password = randomPassword;
      const employee = await Employee.create(Object.assign({}, value, ));
      for (var i = 0; i < value.departments.length; i++) {
        var department = await Department.findById(value.departments[i]);
        var employeesIds = [];
        for (var j = 0; j < department.employees.length; j++) {
          if (value.departments.indexOf(department.employees[j]._id.toString()) == -1) {
            employeesIds.push(department.employees[j]._id.toString());
          }
        }
        employeesIds.push(employee._id);
        await Department.findOneAndUpdate({ _id: value.departments[i] }, {'employees': employeesIds}, {new: false});
      }
      return res.json(employee);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async findOne(req, res) {
    try {
      const { id } = req.params;
      const emp = await Employee.findById(id);
      if (!emp) {
        return res.status(404).json({ err: 'could not find emp' });
      }
      return res.json(emp);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
async login(req, res) {
  try {
    const { value, error } = employeeService.validateLogin(req.body);
    if (error) {
      return res.status(400).json(error);
    }
    const emp = await Employee.findOne({ email: value.email });
    if (!emp) {
      return res.status(401).json({ err: 'Email not register!' });
    }
    console.log(emp.password);
    const authenticted = employeeService.comparePassword(value.password, emp.password);
    if (!authenticted) {
      return res.status(401).json({ err: 'Wrong password!' });
    }
    const token = jwt.issue({ id: emp._id }, '1d');
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
},
async findAll(req, res) {
  try{
    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,

      populate: {
        path: 'departments',
        select: 'title',
      },
    }
      const employees = await Employee.paginate({}, options);
      return res.json(employees);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const schema = Joi.object().keys({
        fullname: Joi.string().optional(),
        email: Joi.string().optional(),
        phone: Joi.string().optional(),
        departments: Joi.array().items().optional(),
        user_create: Joi.optional().allow()
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.json(error);
      }
      const employQuery = await Employee.findById(id);
      var departmentIds = employQuery.departments.toString();
      var departmentIdsArray = [];
      if (departmentIds != "") {
        departmentIdsArray = departmentIds.split(",");
      }
      for (var i = 0; i < value.departments.length; i++) {
        if (departmentIdsArray.indexOf(value.departments[i]) == -1) {
          departmentIdsArray.push(value.departments[i]);
        }
      }

      value.departments = departmentIdsArray;
      const employee = await Employee.findOneAndUpdate({ _id: id }, value, { new: true });
      for (let i = 0; i < value.departments.length; i++) {
        var departQuery = await Department.findById(value.departments[i]);
        if (departQuery.employees.indexOf(employee._id.toString()) == -1) {
          departQuery.employees.push(employee._id.toString());
        }
        await Department.findOneAndUpdate({ _id:  value.departments[i]}, departQuery, { new: true });
      }
      return res.json(employee);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
