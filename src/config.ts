import EventAPI  from './services/graphqlsettings/datasources/event';
import Datastore from 'nedb';
require('dotenv').config()

const datastore = new Datastore({ filename: '.tinlake_events.db', autoload: true });

export const eventAPI = new EventAPI(datastore);

export const config = {
  rpcUrl: process.env.RPC_URL,
  EthFromAddress: process.env.ETH_FROM_ADDRESS,
  cronInterval: 1,
  tinlakeAddresses: JSON.parse(process.env.TINLAKE_ADDRESSES),
  environment: process.env.NODE_ENV || 'development'
};

export default config;
