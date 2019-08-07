# How to run server

```
npm run-script dev_server
```


# How to run worker

```
npm run-script dev_worker
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