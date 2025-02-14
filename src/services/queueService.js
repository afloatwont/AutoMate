class QueueService {
  constructor() {
    this.queue = [];
  }

  join(userId) {
    if (this.queue.includes(userId)) {
      throw new Error('Already in queue');
    }
    this.queue.push(userId);
    return this.queue.length;
  }

  leave(userId) {
    this.queue = this.queue.filter(id => id !== userId);
  }

  cancel(userId) {
    this.queue = this.queue.filter(id => id !== userId);
    this.queue.push(userId);
    return this.queue.length;
  }

  getPosition(userId) {
    return this.queue.indexOf(userId) + 1;
  }
}

export const queueService = new QueueService();