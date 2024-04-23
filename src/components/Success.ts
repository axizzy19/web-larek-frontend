import { Component } from './base/Component'
import {ensureElement} from '../utils/utils'

export interface ISuccess {
  description: number;
}

export interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`, this.container);
    this._description = ensureElement<HTMLElement>(`.${blockName}__description`, this.container);
    
    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
        
      }
    }
  }

  set description(value: number) {
    this._description.textContent = `Списано ${value} синапсов`
  }
}