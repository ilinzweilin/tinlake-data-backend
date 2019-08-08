import { getTinlakeData } from './services/tinlake';
import config, { eventAPI } from './config';

function createEvent() {
  const data = getTinlakeData();
  data.then(result => eventAPI.createEvent(result));
  console.log(`${new Date()} New event saved to db`);
}

const CronJob = require('cron').CronJob;
const rule = `*/${config['runEveryMinute']} * * * *`;

new CronJob(rule, createEvent, null, true, 'UTC');
