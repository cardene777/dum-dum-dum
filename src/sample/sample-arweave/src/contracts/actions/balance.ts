import { State, Action, BalanceResult } from "../types";

declare const ContractError: new (message?: string) => any;

export function balance(state: State, action: Action): BalanceResult {
  const balances = state.balances;
  const target = action.input.target ?? action.caller;
  const ticker = state.ticker;

  if (typeof target !== "string") {
    throw new ContractError("Must specify target to get balance for");
  }

  if (target.length !== 43) {
    throw new ContractError("Target is not valid.");
  }

  return {
    result: {
      target,
      ticker,
      balance: balances[target] || 0,
    },
  };
}
