import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      return res.status(400).json({ error: 'User already exist!' });
    }
    const user = await User.create(req.body);
    const { id, name, email, provider } = user;
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
