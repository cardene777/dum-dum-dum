export interface State {
  balances: { [address: string]: number };
  ticker: string;
  owner: string;
}

export interface Action {
  input: {
    function: string;
    target?: string;
    qty?: number;
    value?: any;
  };
  caller: string;
}

export interface TransferInput {
  function: "transfer";
  target: string;
  qty: number;
}

export interface BalanceInput {
  function: "balance";
  target: string;
}

export interface TransferResult {
  state: State;
}

export interface BalanceResult {
  result: {
    target: string;
    ticker: string;
    balance: number;
  };
}

export interface OwnerResult {
  result: string;
}
