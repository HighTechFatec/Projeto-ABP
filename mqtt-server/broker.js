const aedes = require('aedes')();
const net = require('net');
const { Pool } = require('pg');

const PORT = 1883;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'temp',
  password: '123',
  port: 5432,
});

const server = net.createServer(aedes.handle);

server.listen(PORT, function () {
  console.log(`🚀 MQTT broker started and listening on port ${PORT}`);
});

aedes.on('client', (client) => {
  console.log(`👤 Client connected: ${client.id}`);
});

aedes.on('clientDisconnect', (client) => {
  console.log(`❌ Client disconnected: ${client.id}`);
});

aedes.on('publish', async (packet) => {
  try {
    const payloadStr = packet.payload.toString();
    console.log(`📨 Message received: ${payloadStr}`);

    const data = JSON.parse(payloadStr);
    const { temperature } = data;

    if (typeof temperature === 'number') {
      await pool.query(
        'INSERT INTO temperature_data (temperature) VALUES ($1)',
        [temperature]
      );
      console.log('✅ Temperature saved to database');
    } else {
      console.warn('⚠️ Invalid payload format:', payloadStr);
    }
  } catch (err) {
    console.error('❌ Error saving to DB:', err.message);
  }
});
