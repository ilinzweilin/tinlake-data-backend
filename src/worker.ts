import { getTinlakeData } from './services/tinlake';
import { eventAPI } from './config'
import config from './config'

var CronJob = require('cron').CronJob;

console.log('*/'+config['runEveryMinute']+' * * * *');
new CronJob(config['runEveryMinute']+' * * * *', function() {
    const data = getTinlakeData();
    data.then(result => eventAPI.createEvent(result));
    console.log(new Date()+'New event saved to db');

}, null, true, 'UTC');
