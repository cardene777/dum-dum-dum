import { State, Action, OwnerResult } from "../types";

export function owner(state: State, action: Action): OwnerResult {
  return { result: state.owner };
}
