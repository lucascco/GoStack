import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const { userId } = req;
    const checkProvider = await User.findOne({
      where: { provider: true, id: userId },
    });
    if (!checkProvider) {
      return res.status(401).json({ error: 'User is not provider.' });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({
        createdAt: 'desc',
      })
      .limit(20);
    return res.json(notifications);
  }
}

export default new NotificationController();