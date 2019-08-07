import Datastore from 'nedb';
import { addDays, addHours, addMinutes, differenceInDays, differenceInHours, differenceInMinutes  } from 'date-fns';


class EventAPI {
  datastore: Datastore;

  constructor(datastore: Datastore) {
    this.datastore = datastore;
  }

  getDateRange(startDate, endDate, interval) {
    var dates_list = new Array();

    if (interval == 'day') {
      var days = differenceInDays(endDate, startDate);

      for (let day = 1; day < days; day += 1) {
        let new_date = addDays(startDate, day);
        dates_list.push(new_date);
      }

    }

    if (interval == 'hour') {
      var hours = differenceInHours(endDate, startDate);


      for (let hour = 1; hour < hours; hour += 1) {
        let new_date = addHours(startDate, hour);

        dates_list.push(new_date);
      }

    }

    if (interval == 'minute') {
      var minutes = differenceInMinutes(endDate, startDate);


      for (let minute = 1; minute < minutes; minute += 1) {
        let new_date = addMinutes(startDate, minute);

        dates_list.push(new_date);
      }

    }

    return dates_list;

  }

  async createEvent(date_created: Date, data:
    { total_debt: string, total_balance: string, total_value_of_nfts: string, total_supply: string, number_of_loans: string, whitelisted_loans: string, ongoing_loans: string, repaid_loans: string }) {
    return new Promise((resolve, reject) => {
      const doc = {
        timestamp: date_created,
        total_debt: data['total_debt'],
        total_balance: data['total_balance'],
        total_value_of_nfts: data['total_value_of_nfts'],
        total_supply: data['total_supply'],
        number_of_loans: data['number_of_loans'],
        whitelisted_loans: data['whitelisted_loans'],
        ongoing_loans: data['ongoing_loans'],
        repaid_loans: data['repaid_loans'],
      };

      this.datastore.insert(doc, (err, newDoc) => {
        if (err) { reject(err); } else { resolve(newDoc); }
      });
    });
  }
  async findByPeriod(period: '24h' | '7d' | '30d' | '90d', interval: 'day' | 'hour' | '') {
    return new Promise((resolve, reject) => {
      let days: number = 30;
      if (period === '24h') {
        days = 1;
      } else if (period === '7d') {
        days = 7;
      } else if (period === '30d') {
        days = 30;
      } else if (period === '90d') {
        days = 90;
      }

      var today_date = new Date();

      var end_date = today_date;
      var start_date = new Date();

      start_date.setDate(today_date.getDate() - days);

      start_date.setMinutes(0);
      start_date.setMilliseconds(0);
      start_date.setSeconds(0);

      end_date.setHours(end_date.getHours()+1);
      end_date.setMinutes(0);
      end_date.setMilliseconds(0);
      end_date.setSeconds(0);

      if (interval == 'day' || interval == 'hour') {

        var dates_list = this.getDateRange(start_date, end_date, interval);

        return this.datastore.find(
        { timestamp: { $in: dates_list} },
        (err: Error, docs: any) => {
          if (err) { reject(err); } else { resolve(docs); }
        });

      }
      return this.datastore.find(
        { timestamp: { $gte: start_date, $lte: end_date } },
        (err: Error, docs: any) => {
          if (err) { reject(err); } else { resolve(docs); }
        });
    });
  }


}

export default EventAPI;
