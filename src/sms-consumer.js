const amqp = require('amqplib');
const RABBIT_URL = 'amqp://guest:guest@localhost:5672';

async function startConsumer() {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('sms_queue', { durable: true });

  console.log('📲 SMS Consumer running...');

  channel.consume('sms_queue', (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log('SMS to send:', data);
      channel.ack(msg);
    }
  });
}

startConsumer();
