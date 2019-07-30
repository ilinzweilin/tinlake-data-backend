import { getTinlakeData } from './services/tinlake';
import { eventAPI } from './config';
import config from './config';

const data = getTinlakeData();

tinlake.getCurrentDebt(LoanIDBN);
    // data.then(result => eventAPI.createEvent(result));
    // console.log(new Date()+'New event saved to db');

// var CronJob = require('cron').CronJob;
//
// new CronJob('*/'+config['runEveryMinute']+' * * * *', function() {
//    const data = getTinlakeData();
//    data.then(result => eventAPI.createEvent(result));
//    console.log(new Date()+'New event saved to db');
//
// }, null, true, 'UTC');
