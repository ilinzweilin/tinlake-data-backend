import { IResolvers } from 'graphql-tools';
import { eventAPI } from '../../config';

const resolvers: IResolvers = {
  Query: {
    last1d: async () =>
      await eventAPI.findByPeriod('24h'),
    last7d: async () =>
      await eventAPI.findByPeriod('7d'),
    last30d: async () =>
      await eventAPI.findByPeriod('30d'),
    last90d: async () =>
      await eventAPI.findByPeriod('90d'),
  },
};

export default resolvers;
