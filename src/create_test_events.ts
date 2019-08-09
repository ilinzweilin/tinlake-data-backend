import config, { eventAPI } from './config';
import { getTinlakeData } from './services/tinlake';

function getDatesForEvent() {
  const days_back = 30;
  const todayDate = new Date();
  const endDate = todayDate;
  const startDate = new Date();

  startDate.setDate(todayDate.getDate() - days_back);
  startDate.setMinutes(0);
  startDate.setMilliseconds(0);
  startDate.setSeconds(0);

  endDate.setHours(end_date.getHours() + 1);
  endDate.setMinutes(0);
  endDate.setMilliseconds(0);
  endDate.setSeconds(0);

  const datesList = eventAPI.getDateRange(startDate, endDate, 'minute');
  return datesList;
}

function create_test_events(event) {
  const datesList = getDatesForEvent();

  for (const DateID in datesList) {
    const NewDate = datesList[DateID];
    eventAPI.createEvent(NewDate, event);
  }

}

const TinLakeEvent = getTinlakeData();

TinLakeEvent.then(result => create_test_events(result));
