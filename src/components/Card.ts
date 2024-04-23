import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { CategoryKey } from "../types";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  chosen: boolean
  index: number
}

export class Card<T> extends Component<ICard<T>> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _card: HTMLElement;
  protected _status: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container) ;
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._button = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__description`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
      if (this._button) {
          this._button.addEventListener('click', actions.onClick);
      } else {
          container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
      return this.container.dataset.id || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  set image(value: string) {
      this.setImage(this._image, value, this.title)
  }

  set description(value: string | string[]) {
      if (Array.isArray(value)) {
          this._description.replaceWith(...value.map(str => {
              const descTemplate = this._description.cloneNode() as HTMLElement;
              this.setText(descTemplate, str);
              return descTemplate;
          }));
      } else {
          this.setText(this._description, value);
      }
  }

  set category(value: CategoryKey) {
    this.setText(this._category, value);
    this.setCategory(this.container, value);
  }

  set price(value: string) {
    this.setPrice(this._price, value);
  }

  set selected(value: boolean) {
    if (!this._button.disabled) {
      this._button.disabled = value;
    }
  }
}
