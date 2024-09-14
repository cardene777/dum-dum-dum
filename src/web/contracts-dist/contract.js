// src/contracts/actions/balance.ts
function balance(state, action) {
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
      balance: balances[target] || 0
    }
  };
}

// src/contracts/actions/owner.ts
function owner(state, action) {
  return { result: state.owner };
}

// src/contracts/actions/transfer.ts
function transfer(state, action) {
  const balances = state.balances;
  const input = action.input;
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
  balances[caller] -= qty;
  if (target in balances) {
    balances[target] += qty;
  } else {
    balances[target] = qty;
  }
  return { state };
}

// src/contracts/contract.ts
export async function handle(state, action) {
  const input = action.input;
  switch (input.function) {
    case "owner":
      return owner(state, action);
    case "balance":
      return balance(state, action);
    case "transfer":
      return transfer(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognized: "${input.function}"`
      );
  }
}
