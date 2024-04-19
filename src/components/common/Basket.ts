import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ensureElement, createElement, formatNumber } from '../../utils/utils'
import { Card, ICardActions } from '../Card';

export interface IBasketView {
  items: HTMLElement[];
  total: string;
  selected: string[];
}


export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;
  protected _items: HTMLElement[];


  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');
    
    this._items = [];
    if (this._button) {
      this._button.addEventListener('click', () => {
          events.emit('order:open');
      })
    }

    // console.log(this)
    
  }

  set items(items: HTMLElement[]) {
      if (items.length) {
          this._list.replaceChildren(...items);
      } else {
          this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
              textContent: 'Корзина пуста'
          }));
      }
  }

  // set selected(items: string[]) {
  //   if (items.length) {
  //       this.setDisabled(this._button, false);
  //   } else {
  //       this.setDisabled(this._button, true);
  //   }
  // }

  set total(total: number) {
      this.setText(this._total, formatNumber(total));
  }
}

export interface IBasketItem {
  title: string;
  price: string;
  listNumber: number;
}

export class BasketItem extends Card<IBasketItem> {
  protected _title: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _price: HTMLElement;
  protected _listNumber: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    
    this._title = container.querySelector('.card__title');
    this._listNumber = container.querySelector('.basket__item-index');
    this._button = container.querySelector('.basket__item-delete');
    this._price = container.querySelector('.card__price');
    
    
  }


}