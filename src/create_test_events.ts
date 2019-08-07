import { eventAPI } from './config';
import { getTinlakeData } from './services/tinlake';
import config from './config';


function getDatesForEvent() {
    const days_back = 30;
    var today_date = new Date();
    var end_date = today_date;
    var start_date = new Date();

    start_date.setDate(today_date.getDate() - days_back);
    start_date.setMinutes(0);
    start_date.setMilliseconds(0);
    start_date.setSeconds(0);


    end_date.setHours(end_date.getHours()+1);
    end_date.setMinutes(0);
    end_date.setMilliseconds(0);
    end_date.setSeconds(0);


    try {
        var dates_list = eventAPI.getDateRange(start_date, end_date, 'minute');
    }
    catch(err) {
        console.log('Error: ', err.message);
    }

    return dates_list;
}



function create_test_events(event) {
    var dates_list = getDatesForEvent();

    for (const DateID in dates_list) {
        const NewDate = dates_list[DateID];

        eventAPI.createEvent(NewDate, event);
    }



}

const TinLakeEvent = getTinlakeData();

TinLakeEvent.then(result => create_test_events(result));


