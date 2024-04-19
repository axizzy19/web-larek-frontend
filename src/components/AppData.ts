import _ from "lodash";
import { FormErrors, IAppState, ICard, ICardItem, IOrder, IOrderForm, IOrderFormFirst } from "../types";
import { Model } from "./base/Model";
import { CardStatus } from "../types";

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
    status: CardStatus;

}

export class AppState extends Model<IAppState> {
  basket: string[];
  catalog: CardItem[];
  loading: boolean;
  order: IOrder = {
    email: '',
    phone: '',
    address: '',
    items: [],
    paymentType: ''
  };
  preview: string | null;
  formErrors: FormErrors = {};

  toggleOrderedCard(id: string, isIncluded: boolean) {
    if (isIncluded) {
      this.order.items = _.uniq([...this.order.items, id]);
    }
    else {
      this.order.items = _.without(this.order.items, id);
    }
  }

  clearBasket() {
    this.order.items.forEach(id => {
      this.toggleOrderedCard(id, false);
      // ?
    })
  }

  deleteBasketButton(id: string) {
    
  }

   // итоговая сумма в корзине
  getTotal() {
    return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0);
  }

  // устанавливаем карточки
  setCatalog(items: CardItem[]) {
    // this.catalog = items.map((item) => {
    //   return new CardItem(item, this.events)
    // });
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // устанавливаем превью
  setPreview(item: CardItem) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  // Выбранные карточки
  getActiveCards(): CardItem[] {
    return this.catalog
      .filter(item => item.status === 'active');
      // .filter(item => item.status)
  }

  getClosedCards(): CardItem[] {
    return this.catalog
      .filter(item => item.status === 'closed');
  }

  // оформление покупки
  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
  }

  // валидация формы заказа, проверяет, есть ли ошибки
  validateOrder() {
    const errors: typeof this.formErrors ={};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.paymentType) {
      errors.address = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }


}