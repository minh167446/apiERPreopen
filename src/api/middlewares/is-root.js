import { ROOT_ROLE } from '../resources/user/user.model';

export const isRoot = (req, res, next) => {
  if (req.user.role !== ROOT_ROLE) {
    return res.json({ err: 'unauthorized, not an admin' });
  }
  next();
};
