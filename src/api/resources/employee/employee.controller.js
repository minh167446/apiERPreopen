import employeeService from './employee.service';
import Employee from './employee.model';

export default {
  async create(req, res) {
    try {
      const { value, error } = employeeService.validateBody(req.body);
      if (error && error.details) {
        return res.json(error);
      }
      const employee = await Employee.create(Object.assign({}, value, { user_create: req.user._id }));
      return res.json(employee);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async findAll(req, res) {
    try {
      const employees = await Employee.find()
        .populate('departments')
        .populate('user', 'firstName lastName'); // who create
      return res.json(employees);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
