import Datastore from 'nedb';

class EventAPI {
  datastore: Datastore;

  constructor(datastore: Datastore) {
        this.datastore = datastore;
  }
  async createEvent(data:
    { total_debt: number, total_balance: number, total_value_of_nfts: number, total_supply: number, number_of_loans: number }) {
    return new Promise((resolve, reject) => {
      const doc = {
        timestamp: new Date(),
        total_debt: data['total_debt'],
        total_balance: data['total_balance'],
        total_value_of_nfts: data['total_value_of_nfts'],
        total_supply: data['total_supply'],
        number_of_loans: data['number_of_loans'],
      };

      this.datastore.insert(doc, (err, newDoc) => {
        if (err) { reject(err); } else { resolve(newDoc); }
      });
    });
  }
  async findByPeriod(period: '24h' | '7d' | '30d' | '90d') {
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

      const today_date = new Date();
      const end_date = today_date;
      const start_date = new Date();
      start_date.setDate(today_date.getDate() - days);

      return this.datastore.find(
        { timestamp: { $gte: start_date, $lte: end_date } },
        (err: Error, docs: any) => {
          if (err) { reject(err); } else { resolve(docs); }
        });
    });
  }

}

export default EventAPI;
