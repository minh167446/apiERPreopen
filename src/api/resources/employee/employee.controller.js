import employeeService from './employee.service';
import Employee from './employee.model';
import Department from './../department/department.model';

export default {
  async create(req, res) {
    try {
      const { value, error } = employeeService.validateBody(req.body);
      if (error && error.details) {
        return res.json(error);
      }
      const employee = await Employee.create(Object.assign({}, value, { user_create: req.user._id }));
      for (var i = 0; i < value.departments.length; i++) {
        var department = await Department.findById(value.departments[i]);
        var employeesIds = [];
        for (var j = 0; j < department.employees.length; j++) {
          employeesIds.push(department.employees[j]._id.toString());
        }
        employeesIds.push(value.departments[i]);
        var updateDepart = await Department.findOneAndUpdate({ _id: value.departments[i] }, {'employees': employeesIds}, {new: false});
      }
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
  async update(req, res) {
    try {
      const { value, error } = employeeService.validateBody(req.body);
      if (error && error.details) {
        return res.json(error);
      }
      const { id } = req.params;
      const employQuery = await Employee.findById(id);
      value.departments.push(employQuery.departments.toString());
      
      const employee = await Employee.findOneAndUpdate({ _id: id }, value, { new: true });

      return res.json(employee);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
