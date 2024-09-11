import { Action, State, TransferInput, TransferResult } from "../types";

declare const ContractError: new (message?: string) => any;

export function transfer(state: State, action: Action): TransferResult {
  const balances = state.balances;
  const input = action.input as TransferInput;
  const caller = action.caller;
  const target = input.target;
  const qty = input.qty;

  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }

  if (!target) {
    throw new ContractError("No target specified");
  }

  if (qty <= 0 || caller === target) {
    throw new ContractError("Invalid token transfer");
  }

  if (balances[caller] < qty) {
    throw new ContractError(
      `Caller balance not high enough to send ${qty} token(s)!`
    );
  }

  // Lower the token balance of the caller
  balances[caller] -= qty;
  if (target in balances) {
    // Wallet already exists in state, add new tokens
    balances[target] += qty;
  } else {
    // Wallet is new, set starting balance
    balances[target] = qty;
  }

  return { state };
}
