import Datastore from 'nedb';
import { addDays, addHours, addMinutes, differenceInDays,
  differenceInHours, differenceInMinutes } from 'date-fns';

class EventAPI {
  datastore: Datastore;

  constructor(datastore: Datastore) {
    this.datastore = datastore;
  }

  getDateRange(startDate, endDate, interval) {
    const datesList = Array();
    if (interval === 'day') {
      const days = differenceInDays(endDate, startDate);

      for (let day = 1; day <= days; day += 1) {
        const newDate = addDays(startDate, day);
        datesList.push(newDate);
      }

    }

    if (interval === 'hour') {
      const hours = differenceInHours(endDate, startDate);

      for (let hour = 1; hour < hours; hour += 1) {
        const new_date = addHours(startDate, hour);
        datesList.push(new_date);
      }

    }

    if (interval === 'minute') {
      const minutes = differenceInMinutes(endDate, startDate);
      for (let minute = 1; minute < minutes; minute += 1) {
        const new_date = addMinutes(startDate, minute);
        datesList.push(new_date);
      }
    }
    return datesList;
  }

  async createEvent(dateCreated: Date, data:
    {
      total_debt: string, total_balance: string, total_value_of_nfts: string,
      total_supply: string, number_of_loans: string, whitelisted_loans: string,
      ongoing_loans: string, repaid_loans: string,
    }) {
    return new Promise((resolve, reject) => {
      const doc = {
        timestamp: dateCreated,
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
      let days: number;
      if (period === '24h') {
        days = 1;
      } else if (period === '7d') {
        days = 7;
      } else if (period === '30d') {
        days = 30;
      } else if (period === '90d') {
        days = 90;
      }

      const todayDate = new Date();
      const endDate = todayDate;
      const startDate = new Date();

      startDate.setDate(todayDate.getDate() - days);
      startDate.setMinutes(0);
      startDate.setMilliseconds(0);
      startDate.setSeconds(0);

      endDate.setHours(endDate.getHours() + 1);
      endDate.setMinutes(0);
      endDate.setMilliseconds(0);
      endDate.setSeconds(0);

      if (interval === 'day' || interval === 'hour') {

        const datesList = this.getDateRange(startDate, endDate, interval);
        return this.datastore.find(
          { timestamp: { $in: datesList } },
          (err: Error, docs: any) => {
            if (err) { reject(err); } else { resolve(docs); }
          });
      }
      
      return this.datastore.find(
        { timestamp: { $gte: startDate, $lte: endDate } },
        (err: Error, docs: any) => {
          if (err) { reject(err); } else { resolve(docs); }
        });
       
    });
  }

}

export default EventAPI;