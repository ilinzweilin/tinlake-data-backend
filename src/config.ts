import EventAPI  from './services/graphqlsettings/datasources/event';
import Datastore from 'nedb';
import path from 'path';
require('dotenv').config();

export const config = {
  rpcUrl: process.env.RPC_URL,
  EthFromAddress: process.env.ETH_FROM_ADDRESS,
  cronInterval: 1,
  tinlakeAddresses: JSON.parse(process.env.TINLAKE_ADDRESSES),
  environment: process.env.NODE_ENV || 'development',
  dbPath: process.env.DB_PATH || './data/',
  transactionTimeout: parseInt(process.env.TRANSACTION_TIMEOUT, 10)
};

const dbFileName = path.join(config.dbPath, ".tinlake_events.db");
const datastore = new Datastore({ filename: dbFileName, autoload: true });
export const eventAPI = new EventAPI(datastore);
export default config;
