class QueueService {
  constructor() {
    this.queue = [];
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  emitQueueUpdate() {
    if (this.io) {
      this.io.emit('queueUpdate', {
        queue: this.queue,
        length: this.queue.length
      });
    }
  }

  join(user) {
    if (this.queue.includes(user.email)) {
      throw new Error('Already in queue');
    }
    this.queue.push(user.email);
    this.emitQueueUpdate();
    return this.getPosition(user.email);
  }

  leave(user) {
    this.queue = this.queue.filter(email => email !== user.email);
    this.emitQueueUpdate();
  }

  cancel(user) {
    this.queue = this.queue.filter(email => email !== user.email);
    this.queue.push(user.email);
    this.emitQueueUpdate();
    return this.getPosition(user.email);
  }

  getPosition(email) {
    return this.queue.indexOf(email) + 1;
  }

  getCurrentQueue() {
    return this.queue;
  }
}

export const queueService = new QueueService();