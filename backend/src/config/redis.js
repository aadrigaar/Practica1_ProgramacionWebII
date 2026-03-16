const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL;
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false' && !!REDIS_URL;

function createNoopClient() {
  return {
    isOpen: false,
    connect: async () => {
      console.log('Redis desactivado (sin REDIS_URL o REDIS_ENABLED=false)');
    },
    quit: async () => {},
    get: async () => null,
    set: async () => {},
    del: async () => {},
    on: () => {}
  };
}

const client = REDIS_ENABLED
  ? redis.createClient({ url: REDIS_URL })
  : createNoopClient();

if (REDIS_ENABLED) {
  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('ready', () => console.log('Redis Client Ready'));
}

module.exports = client;
