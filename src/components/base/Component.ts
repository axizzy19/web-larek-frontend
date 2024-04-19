import { CategoryKey, Category, CardStatus } from "../../types";

export abstract class Component<T> {
  protected constructor(protected container: HTMLElement) {

  }

  toggleClass(element: HTMLElement, className: string) {
    element.classList.toggle(className);
  }

   // Установить текстовое содержимое
   protected setText(element: HTMLElement, value: unknown) {
      if (element) {
          element.textContent = String(value);
      }
    }

    protected setPrice(element: HTMLElement, value: unknown) {
        if (element) {
            if (String(value) != 'null') {
                element.textContent = `${String(value)} синапсов`;
            } else {
                element.textContent = `Бесценно`;
            }
            
        }
    }


    protected setCategory(element: HTMLElement, value: CategoryKey) {
        if (element) {
            element.querySelector('.card__category').classList.add(`card__category_${Category[value]}`);
        }
    }

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean) {
      if (element) {
          if (state) element.setAttribute('disabled', 'disabled');
          else element.removeAttribute('disabled');
      }
  }

  // Скрыть
  protected setHidden(element: HTMLElement) {
      element.style.display = 'none';
  }

  // Показать
  protected setVisible(element: HTMLElement) {
      element.style.removeProperty('display');
  }

  // Установить изображение с алтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
      if (element) {
          element.src = src;
          if (alt) {
              element.alt = alt;
          }
      }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;

  }
}