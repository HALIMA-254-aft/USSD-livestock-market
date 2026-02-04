// This is optional for real SMS notifications
const amqp = require('amqplib');

let channel;

async function connectRabbit() {
  const conn = await amqp.connect('amqp://localhost'); // or your deployed RabbitMQ URL
  channel = await conn.createChannel();
  await channel.assertQueue('smsQueue');
  console.log('Connected to RabbitMQ');
}

async function publishSMS(phone, message) {
  if (!channel) return;
  channel.sendToQueue('smsQueue', Buffer.from(JSON.stringify({ phone, message })));
}

module.exports = { connectRabbit, publishSMS };
