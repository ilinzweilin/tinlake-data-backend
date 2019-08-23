import { getTinlakeData } from './services/tinlake';
import config, { eventAPI } from './config';

async function createEvent() {
  const data = await getTinlakeData();
  const dateCreated = new Date();
  dateCreated.setMilliseconds(0);
  dateCreated.setSeconds(0);
  eventAPI.createEvent(dateCreated, data);
  console.log(`${new Date()} New event saved to db ${JSON.stringify(data)}`);
}
console.log(
   '🚀 Worker ready');

const CronJob = require('cron').CronJob;
const rule = `*/${config['cronInterval']} * * * *`;

new CronJob(rule, createEvent, null, true, 'UTC');
