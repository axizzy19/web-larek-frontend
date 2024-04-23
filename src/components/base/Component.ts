import { CategoryKey, Category, CardStatus } from "../../types";

export abstract class Component<T> {
    protected constructor(protected container: HTMLElement) {}

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Установаить цену
    protected setPrice(element: HTMLElement, value: unknown) {
        if (element) {
            if (String(value) != 'null') {
                element.textContent = `${String(value)} синапсов`;
            } else {
                element.textContent = `Бесценно`;
            }
        }
    }

    // Установаить категорию
    protected setCategory(element: HTMLElement, value: CategoryKey) {
        if (element) {
            element.querySelector('.card__category').classList.add(`card__category_${Category[value]}`);
        }
    }

    // Сменить статус блокировки
    protected setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
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