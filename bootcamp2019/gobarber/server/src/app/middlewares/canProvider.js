import User from '../models/User';

export default async (req, res, next) => {
  const { userId } = req;

  const user = await User.findByPk(userId);

  if (user.provider) {
    return next();
  }
  return res.status(401).json({ error: 'Only access by provider.' });
};
