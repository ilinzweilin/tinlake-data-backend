import { getTinlakeData } from './services/tinlake';
import config, { eventAPI } from './config';

function createEvent() {
  const data = getTinlakeData();
  const dateCreated = new Date();
  dateCreated.setMilliseconds(0);
  dateCreated.setSeconds(0);
  data.then(result => eventAPI.createEvent(dateCreated, result));
  console.log(`${new Date()} New event saved to db`);
}
console.log(
   '🚀 Worker ready');

const CronJob = require('cron').CronJob;
const rule = `*/${config['runEveryMinute']} * * * *`;

new CronJob(rule, createEvent, null, true, 'UTC');
