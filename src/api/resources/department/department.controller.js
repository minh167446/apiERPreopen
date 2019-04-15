import Joi from 'joi';
import Department from './department.model';
import Employee from '../employee/';
export default {
  async create(req, res) {
    try {
      const schema = Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        employees: Joi.array().items(),
        parent_id: Joi.string().optional().allow('')
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.status(400).json(error);
      }
      const department = await Department.create({
        title: value.title,
        description: value.description,
        location: value.location,
        employees: value.employe,
        parent_id: value.parent_id || null
      });
      return res.json(department);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async findAll(req, res) {
    try {
      const { page, perPage } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 100,
        populate: [{
          path: 'employees',
          select: 'fullname email phone',
        }],
      };
      const departments = await Department.paginate({}, options);
      for (var i = 0; i < departments.docs.length; i++) {
        var childs = await Department.find({parent_id: departments.docs[i]._id}).select("title");
        departments.docs[i]._doc.childs = childs;
      }
      return res.json(departments);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
  ,
  async findOne(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findById(id).populate('employees', 'id fullname');

      if (!department) {
        return res.status(404).json({ err: 'could not find department' });
      }
      return res.json(department);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findOneAndRemove({ _id: id });
      if (!department) {
        return res.status(404).json({ err: 'could not find department' });
      }
      return res.json(department);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const schema = Joi.object().keys({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        location: Joi.string().optional(),
        employees: Joi.array().items().optional(),
      });
      const { value, error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.status(400).json(error);
      }
      const department = await Department.findOneAndUpdate({ _id: id }, value, { new: true });
      if (!department) {
        return res.status(404).json({ err: 'could not find department' });
      }
      return res.json(department);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
