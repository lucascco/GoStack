import * as Yup from 'yup';
import { isBefore, parseISO, startOfHour, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';
import NotificationSchema from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const {
      userId: user_id,
      query: { page },
    } = req;
    const appointments = await Appointment.findAll({
      where: { canceled_at: null, user_id },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
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
    res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation data fails' });
    }

    const { provider_id, date } = req.body;

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with provider.' });
    }

    const startHour = startOfHour(parseISO(date));

    if (isBefore(startHour, new Date())) {
      return res.status(400).json({ error: 'Past date is not allow.' });
    }
    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: startHour },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'This date is already busy.' });
    }

    const appointment = await Appointment.create({
      provider_id,
      date,
      user_id: req.userId,
    });

    const userClient = await User.findByPk(req.userId);

    const dateFormated = format(startHour, "'dia' dd 'de' MMMM', ás' H:mm'h'", {
      locale: pt,
    });

    await NotificationSchema.create({
      content: `Novo agendamento para ${userClient.name} para ${dateFormated}.`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
