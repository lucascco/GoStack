import Bee from 'bee-queue';
import MailCancellation from '../app/jobs/MailCancellation';
import redisConfig from '../config/redis';

const jobs = [MailCancellation];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  addJob(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { handle, bee } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
