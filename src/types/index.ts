export type CardStatus = 'active' | 'closed'; 

// интерфейс карточки с продажей
export interface ISale {
  status: CardStatus;
  price: number;
}

// интерфейс карточки общий
export interface ICardItem {
  id: string;
  title: string;
  description: string; 
  category: string;
  image: string;
  price: number;
}

export type ICard = ICardItem & ISale;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderFormFirst {
  paymentType: string;
  address: string;
}

export interface IOrderFormSecond {
  email: string;
  phone: string;
}

export type IOrderForm = IOrderFormFirst & IOrderFormSecond;

export interface IOrder extends IOrderFormFirst, IOrderFormSecond {
  items: string[];
}

export interface IAppState {
  catalog: ICard[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}

export type CategoryKey =
	| 'софт-скил'
	| 'другое'
	| 'кнопка'
	| 'дополнительное'
	| 'хард-скил';

export const Category: { [key in CategoryKey]: string} = {
    'софт-скил': 'soft',
	'другое': 'other',
	'кнопка': 'button',
	'дополнительное': 'additional',
	'хард-скил': 'hard',
}