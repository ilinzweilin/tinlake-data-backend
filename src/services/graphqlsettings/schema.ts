import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    last1d(interval: String): [TinlakeEvent]!
    last7d(interval: String): [TinlakeEvent]!
    last30d(interval: String): [TinlakeEvent]!
    last90d(interval: String): [TinlakeEvent]!
  }

  type TinlakeEvent {
    timestamp: String
    total_debt: String
    total_balance: String
    total_value_of_nfts: String
    total_supply: String
    number_of_loans: String
    whitelisted_loans: String
    ongoing_loans: String
    repaid_loans: String
  }
`;

export default typeDefs;
