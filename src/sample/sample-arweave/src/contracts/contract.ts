import { balance } from "./actions/balance";
import { owner } from "./actions/owner";
import { transfer } from "./actions/transfer";
import { Action, State } from "./types";

declare const ContractError: new (message?: string) => any;

export async function handle(state: State, action: Action) {
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
