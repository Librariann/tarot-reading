import type { ActionFunctionArgs } from "react-router";

export interface ActionArgs extends ActionFunctionArgs {}
export interface MetaArgs {
  data?: any;
  matches?: any[];
}

export namespace Route {
  export type ActionArgs = RevealCardsActionArgs;
  export type MetaArgs = RevealCardsMetaArgs;
}

type RevealCardsActionArgs = ActionArgs;
type RevealCardsMetaArgs = MetaArgs;
