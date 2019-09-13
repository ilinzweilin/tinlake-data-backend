import Datastore from 'nedb';
import { TinlakeEventEntry } from '../../tinlake';

class EventAPI {
  datastore: Datastore;

  constructor(datastore: Datastore) {
    this.datastore = datastore;
    this.createIndex()
  }

  createIndex() {
    this.datastore.ensureIndex({ fieldName: 'timestamp' }, function (err) {
      if (!err) {
        console.log("index created")
        return
      }
      console.log(`index could not be created ${err}`)
    })
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
    let days: number;
    let data: TinlakeEventEntry[] = []

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

    let entries: TinlakeEventEntry[] = []
    try {
      entries = await new Promise((resolve, reject) =>
        this.datastore.find({ timestamp: { $gte: startDate, $lte: endDate } },
          (err: Error, docs: any) => {
            if (err) { reject(err); } else { resolve(docs); }
        })
      )
    } catch (e) {
      console.log("Error retrieving data from database", e)
      throw (e)
    }

    let entriesMap = {}
    if (interval === 'day') {
      entriesMap = entries.reduce((dayMap, currentEntry: TinlakeEventEntry) => {
        const day = (new Date(currentEntry.timestamp)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (!dayMap[`${day}`]) {
          dayMap[`${day}`] = []
        }
        dayMap[`${day}`].push(currentEntry)
        return dayMap
      }, {})
    }

    for (let key in entriesMap) {
      const dayEntries = entriesMap[key]
      entriesMap[key] = sortByTimestamp(dayEntries)
      const latestEntryInPeriod = entriesMap[key][entriesMap[key].length - 1]
      data.push(latestEntryInPeriod)
    }
    return data && sortByTimestamp(data)
  }

}
function sortByTimestamp(entries: TinlakeEventEntry[]) {
  return entries.sort((a: TinlakeEventEntry, b: TinlakeEventEntry) => (new Date(a.timestamp).getTime()) > (new Date(b.timestamp).getTime()) ? 1 : -1)
}

export default EventAPI;