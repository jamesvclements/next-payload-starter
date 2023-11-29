import express from 'express';
import payload from 'payload';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });
  app.listen(process.env.PORT);
  if (process.env.NODE_ENV === 'development') {
    console.log(`[cms] ready on http://localhost:${process.env.PORT}`)
  }
};

start();
