import { defineAbilitiesFor } from '../config/casl.js';

const authorize = (action, subject) => {
  return (req, res, next) => {
    const ability = defineAbilitiesFor(req.user);

    if (ability.can(action, subject)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};

export default authorize;
