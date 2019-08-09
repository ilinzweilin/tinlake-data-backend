# How to run server

```
npm run-script dev_server
```


# How to run worker, every one minute worker will same to database snapshot for tinlake data.

```
npm run-script dev_worker
```

In order to have test events on local you can run following, this will save to db events from last 30 days.

```
npm run-script create_test_events
```

# Query examples


# Events for last X days, accepted values last1d, last7d, last30d, last90d

```
{
  last1d{
   timestamp
   total_debt
   total_balance
   total_value_of_nfts
   total_supply
   number_of_loans
   whitelisted_loans
   repaid_loans
  }
}
```

# Events for interval. Accepted values: hour, day

```
{
  last1d(interval:"hour"){
   timestamp
   total_debt
   total_balance
   total_value_of_nfts
   total_supply
   number_of_loans
   whitelisted_loans
   repaid_loans
  }
}
```


```
{
  last7d(interval:"day"){
   timestamp
   total_debt
   total_balance
   total_value_of_nfts
   total_supply
   number_of_loans
   whitelisted_loans
   repaid_loans
  }
}
```