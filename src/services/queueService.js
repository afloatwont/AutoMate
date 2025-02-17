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


  leave(user) {
    this.queue = this.queue.filter(u => u.email !== user.email); 
    this.emitQueueUpdate();
  }

  // PUSH TO THE END OF THE QUEUE
  cancel(user) {
    this.queue = this.queue.filter(u => u.email !== user.email); // Filter by email
    this.queue.push(user); // Add user object
    this.emitQueueUpdate();
    return this.getPosition(user.email);
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