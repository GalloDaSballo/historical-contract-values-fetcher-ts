export interface Product {
  price: number;
}

export interface ProductInCart extends Product {
  quantity: number;
}

export type Cart = ProductInCart[];

export type ChainLinkReturnData = {
  roundId: string;
  answer: string;
  startedAt: string;
  updatedAt: string;
  answeredInRound: string;
}