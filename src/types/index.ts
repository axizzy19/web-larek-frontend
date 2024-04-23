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
  chosen: boolean
}

export type ICard = ICardItem & ISale;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
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

export type IPaymentType = 'card' | 'cash';

export type ApiResponse<T> = {
  total: number,
  items: T[]
}