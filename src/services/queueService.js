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

  join(userId) {
    if (this.queue.includes(userId)) {
      throw new Error('Already in queue');
    }
    this.queue.push(userId);
    this.emitQueueUpdate();
    return this.queue.length;
  }

  leave(userId) {
    this.queue = this.queue.filter(id => id !== userId);
    this.emitQueueUpdate();
  }

  cancel(userId) {
    this.queue = this.queue.filter(id => id !== userId);
    this.queue.push(userId);
    this.emitQueueUpdate();
    return this.queue.length;
  }

  getPosition(userId) {
    return this.queue.indexOf(userId) + 1;
  }
}

export const queueService = new QueueService();