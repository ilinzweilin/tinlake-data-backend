import Tinlake from 'tinlake';
import { sign } from 'ethjs-signer';
const SignerProvider = require('ethjs-provider-signer');
import config from './../../config';
import BN from 'bn.js';

const NodeCache = require('node-cache');
const LoanCache = new NodeCache();
const contractAddresses = config.tinlakeAddresses

export type TinlakeEventEntry = {
  total_debt: string
  total_balance: string
  total_value_of_nfts: string
  total_supply: string
  number_of_loans: string
  whitelisted_loans: string
  ongoing_loans: string
  repaid_loans: string
  timestamp: string
}

export async function getTinlake() {
  return new Tinlake(
    new SignerProvider(config['rpcUrl'], {
      signTransaction: (rawTx: any, cb: (arg0: null, arg1: any) => void) =>
        cb(null, sign(rawTx, config[''])),
      accounts: (cb: (arg0: null, arg1: string[]) => void) => cb(null, [config['EthFromAddress']]),
    }),
    contractAddresses,
    [],
    config.transactionTimeout,
    {
      ethConfig: { from: config['EthFromAddress'] },
    },
  );
}

async function getTotalDebt(tinlake: Tinlake, allLoans) {
  let debt: BN = new BN(0);

  for (const loanID in allLoans) {
    const loan = allLoans[loanID];
    const LoanIDBN = loanID.toString();
    const BalanceDebt = await tinlake.getBalanceDebt(LoanIDBN);

    if (BalanceDebt.debt > new BN(0)) {
      const curDept = await tinlake.getCurrentDebt(LoanIDBN);
      debt = debt.add(curDept);
    }

  }
  return debt;

}

async function getLoansCountbyStatus(tinlake: Tinlake, allLoans, status) {
  let value: BN = new BN(0);
  for (const loanID in allLoans) {
    const loan = allLoans[loanID];

    if (loan.status === status) {
      value = value.add(new BN(1));
    }
  }

  return value;

}

async function getAllLoans(tinlake, loansCount) {
  const loans = [];
  for (let loanId = 0; loanId < loansCount; loanId += 1) {

    let loan = LoanCache.get(loanId);

    if (loan === undefined) {
      loan = await tinlake.getLoan(loanId);
    }
    const BalanceDebtRes = await tinlake.getBalanceDebt(loanId);
    const BalanceDebt = BalanceDebtRes.debt;
    if (loan.principal > 0) {
      loan['status'] = 'Whitelisted';
    } else if (loan.principal === 0 && BalanceDebt > 0) {
      loan['status'] = 'Ongoing';
    } else if (loan.principal === 0 && BalanceDebt === 0) {
      loan['status'] = 'repaid';
      LoanCache.set(loanId, loan);
    } else {
      loan['status'] = 'other';
    }

    loans[loanId] = loan;
  }
  return loans;
}

export async function getTinlakeData() {
  const tinlake = await getTinlake();

  const loanCountBn: BN = await tinlake.loanCount();

  const allLoans = await getAllLoans(tinlake, loanCountBn.toNumber());
  const TotalDebt = await getTotalDebt(tinlake, allLoans);

  const TotalBalance = await tinlake.contracts.pile.Balance();
  const TotalValueofNFTs = await tinlake.contracts.shelf.bags();
  const TotalSupply = await tinlake.contracts.collateral.totalSupply();
  const TotalWhitelisted = await getLoansCountbyStatus(tinlake, allLoans, 'Whitelisted');
  const TotalOngoing = await getLoansCountbyStatus(tinlake, allLoans, 'Ongoing');
  const TotalRepaid = await getLoansCountbyStatus(tinlake, allLoans, 'repaid');

  const data = {
    total_debt: TotalDebt.toString(),
    total_balance: TotalBalance[0].toString(),
    total_value_of_nfts: TotalValueofNFTs[0].toString(),
    total_supply: TotalSupply[0].toString(),
    number_of_loans: loanCountBn.toString(),
    whitelisted_loans: TotalWhitelisted.toString(),
    ongoing_loans: TotalOngoing.toString(),
    repaid_loans: TotalRepaid.toString(),
  };

  return data;
}
