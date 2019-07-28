import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class MailCancellation {
  get key() {
    return 'MailCancellation';
  }

  async handle({ data }) {
    const { appointment } = data;
    await Mail.sendEmail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado.',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', ás' H:mm'h'"
        ),
      },
    });
  }
}

export default new MailCancellation();
