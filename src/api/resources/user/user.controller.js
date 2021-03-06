import userService from './user.service';
import User, { STANDARD_ROLE } from './user.model';
import jwt from '../../helpers/jwt';

export default {
  async signup(req, res) {
    try {
      const { value, error } = userService.validateSignup(req.body);
      if (error) {
       return res.status(400).json(error);
      }
      const encryptedPass = userService.encryptPassword(value.password);

      const user = await User.create({
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        password: encryptedPass,
        role: value.role || STANDARD_ROLE,
      });
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async login(req, res) {
    try {
      const { value, error } = userService.validateLogin(req.body);
      if (error) {
        return res.status(400).json(error);
      }
      const user = await User.findOne({ email: value.email });
      if (!user) {
        return res.status(401).json({ err: 'Email not register!' });
      }
      const authenticted = userService.comparePassword(value.password, user.password);
      if (!authenticted) {
        return res.status(401).json({ err: 'Wrong password!' });
      }
      const token = jwt.issue({ id: user._id }, '1d');
      return res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  authenticate(req, res) {
    return res.json(req.user);
  },

  async listAll(req, res) {
    try {
      const { page, perPage } = req.query;
      const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,

        populate: {
          path: 'user',
          select: 'email',
        },
      }
      const users = await User.paginate({}, options);
      // const users = await User.find();
      return res.json({ users:users })
    }catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
