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
        length: this.queue.length,
        queueDetails: this.queue.map((user, index) => ({ 
          user,
          position: index + 1
        }))
      });
      console.log('Queue updated');
    }
  }

  join(user) {
    if (this.queue.some(u => u.email === user.email)) { // Check for existing user by email
      throw new Error('Already in queue');
    }
    this.queue.push(user);
    this.emitQueueUpdate();
    return this.getPosition(user.email);
  }

  // Just remove from queue
  leave({ email }) {
    this.queue = this.queue.filter(u => u.email !== email);
    this.emitQueueUpdate();
  }

  // Move to end of queue
  cancel({ email }) {
    if (this.queue.length > 1) {
      const user = this.queue.find(u => u.email === email);
      if (!user) return;
      
      this.queue = this.queue.filter(u => u.email !== email);
      this.queue.push(user);
    }
    this.emitQueueUpdate();
    return this.getPosition(email);
  }

  getPosition(email) {
    return this.queue.findIndex(u => u.email === email) + 1; // Find index by email
  }

  getCurrentQueue() {
    return {
      queue: this.queue,
      length: this.queue.length,
      queueDetails: this.queue.map((user, index) => ({ // Send user objects
        user,
        position: index + 1
      }))
    };
  }
}

export const queueService = new QueueService();