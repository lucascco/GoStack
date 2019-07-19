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

  async update(req, res) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      return res.json(notification);
    } catch (e) {
      if (e.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Notification not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new NotificationController();
