import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const {
      userId: provider_id,
      query: { page, date },
    } = req;
    const checkProvider = await User.findOne({
      where: { provider: true, id: provider_id },
    });
    if (!checkProvider) {
      return res.status(401).json({ error: 'User is not provider.' });
    }
    const dateObj = parseISO(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(dateObj), endOfDay(dateObj)],
        },
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
