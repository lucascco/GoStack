import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const { userId } = req;
    const notifications = await Notification.find({ user: userId })
      .sort({
        createdAt: 'desc',
      })
      .limit(20);
    return res.json(notifications);
  }
}

export default new NotificationController();
