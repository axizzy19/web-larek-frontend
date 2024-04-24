import _ from "lodash";
import { FormErrors, IAppState, ICard, IOrder, IOrderForm } from "../types";
import { Model } from "./base/Model";

export type CatalogChangeEvent = {
  catalog: CardItem[];
}

export class CardItem extends Model<ICard> {
    id: string;
    title: string;
    description: string; 
    category: string;
    image: string;
    price: number;
    chosen: boolean;
}

export interface IBasket {
  items: HTMLElement[],
  total: number
}

export class AppState extends Model<IAppState> {
  basket: CardItem[] = [];
  catalog: CardItem[];
  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };
  preview: string | null;
  formErrors: FormErrors = {};
  productLine: CardItem[]; // каталог
  

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  addToBasket(item: CardItem) {
    this.basket.push(item);
    this.emitChanges('basket:changed', this.basket);
    return this.basket;
  }

  removeFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id!== id)
  }

  getBasketTotal() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  getBasketAmount() {
    return this.basket.length;
  }

  setProductLine(items: CardItem[]) {
    this.productLine = items.map((item) => new CardItem({...item, chosen: false}, this.events));
    this.emitChanges('items:changed', { productLine: this.productLine })
  }

  // устанавливаем карточки
  setCatalog(items: CardItem[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // устанавливаем превью
  setPreview(item: CardItem) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  // оформление покупки
  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  refreshOrder() {
    this.order = {
      items: [],
      payment: '',
      address: '',
      email: '',
      phone: '',
      total: null
    }
  }

  clearBasket() {
    this.basket.length = 0;
  }

  // валидация формы заказа, проверяет, есть ли ошибки
  validateOrder() {
    const errors: typeof this.formErrors ={};
    
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.address = 'Необходимо указать способ оплаты';
    }
  
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors ={};

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

}