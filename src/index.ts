import { API } from './api';

const port = process.env.PORT;

const server = API().listen(port, (err?: any) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Listening on port ${port}`);
});

process.on('SIGINT', () => {
  if (server.listening) {
    console.log('Attempting to exit gracefully.');
    server.close(() => {
      console.log('Server closed. Quitting.');
      process.exit();
    });
  }
});