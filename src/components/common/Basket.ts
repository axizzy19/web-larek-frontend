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

  constructor(container: HTMLElement, protected events: EventEmitter ) {
    super(container);
    
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');
    
    if (this._button) {
      this._button.addEventListener('click', () => this.events.emit('basket:order'))
    }
  }

  set items(items: HTMLElement[]) {
      if (items.length) {
          this._list.replaceChildren(...items);
          this.setDisabled(this._button, false);
      } else {
          this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
              textContent: 'Корзина пуста'
          }));
          this.disableButton()
      }
  }

  set total(total: number) {
      this.setText(this._total, `${formatNumber(total)} синапсов`);
  }

  disableButton() {
    this.setDisabled(this._button, true)
  }

  resetIndex() {
    Array.from(this._list.children).forEach((item, index) => {
      item.querySelector('.basket__item-index')!.textContent = String((index+1))
    })
  }
}

export interface IBasketItem {
  title: string;
  price: string;
  index: number;
}

export class BasketItem extends Card<IBasketItem> {
  protected _title: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _price: HTMLElement;
  protected _index: HTMLElement;
  
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    
    this._title = container.querySelector('.card__title');
    this._index = container.querySelector('.basket__item-index');
    this._button = container.querySelector('.basket__item-delete');
    this._price = container.querySelector('.card__price');
    
    if (actions?.onClick) {
      if (this._button) {
          this._button.addEventListener('click', () => {
            this.container.remove();
            actions.onClick;
          });
      } else {
          container.addEventListener('click', actions.onClick);
      }
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }

}