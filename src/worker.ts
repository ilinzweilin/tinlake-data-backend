import { getTinlakeData } from './services/tinlake';
import config, { eventAPI } from './config';

function createEvent() {
    const data = getTinlakeData();
    var date_created = new Date();
    date_created.setMilliseconds(0);
    date_created.setSeconds(0);
    data.then(result => eventAPI.createEvent(date_created, result));
    console.log(new Date()+'New event saved to db');
}
console.log(
    '🚀 Worker ready')

const CronJob = require('cron').CronJob;
const rule = `*/${config['runEveryMinute']} * * * *`;

new CronJob(rule, createEvent, null, true, 'UTC');
