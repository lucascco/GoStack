import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  setSeconds,
  setMinutes,
  setHours,
  format,
  isAfter,
} from 'date-fns';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const {
      query: { date },
      params: { idProvider },
    } = req;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: idProvider,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const hoursDay = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const availables = hoursDay.map(time => {
      const [hour, minute] = time.split(':');
      const dateAvailable = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      return {
        time,
        value: format(dateAvailable, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(dateAvailable, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });
    return res.json(availables);
  }
}

export default new AvailableController();
