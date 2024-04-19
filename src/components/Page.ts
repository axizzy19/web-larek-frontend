import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
  catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected _catalog: HTMLElement;
  protected _basket: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open'); 
  })
  }

  // устанавливаем каталог
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  // set locked(value: boolean) {
  //   if (value) {
  //       this._wrapper.classList.add('page__wrapper_locked');
  //   }
  //   else {
  //       this._wrapper.classList.remove('page__wrapper_locked');
  //   }
  // }
}