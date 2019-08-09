import { IResolvers } from 'graphql-tools';
import { eventAPI } from '../../config';

const resolvers: IResolvers = {
  Query: {
    last1d: async (_, { interval }) =>
      await eventAPI.findByPeriod('24h', interval),
    last7d: async (_, { interval }) =>
      await eventAPI.findByPeriod('7d', interval),
    last30d: async (_, { interval }) =>
      await eventAPI.findByPeriod('30d', interval),
    last90d: async (_, { interval }) =>
      await eventAPI.findByPeriod('90d', interval),
  },
};

export default resolvers;
