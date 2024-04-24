# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Presenter
Компоненты представления

### Класс EventEmitter
Брокер событий

Аргументы:

`` events `` - события;

Методы:

`` on, off, emit `` - добавить и снять обработчик, слушать все события;

## View

Слой отображения, задача - выводить что-то на экран и генерировать события с действиями пользователя.

### Класс Component

Базовый компонент карточки, принимает в переменной T тип данных

Конструктор принимает такие аргументы:

``container: HTMLElement`` - составляющий компонент;

Методы: 

`` set `` - для установки значений;

`` render(data): HTMLElement `` - возвращает корневой DOM-элемент;

Типы:

`` export type CategoryKey =
	| 'софт-скил'
	| 'другое'
	| 'кнопка'
	| 'дополнительное'
	| 'хард-скил'; `` - описывает ключ для категории

Другие Методы:

`` setText(element: HTMLElement, value: unknown) `` - для установки текста;

`` setPrice(element: HTMLElement, value: unknown) `` - для установки текста;

`` setCategory(element: HTMLElement, value: CategoryKey) `` - для установки категории;

`` setDisabled(element: HTMLElement, state: boolean) `` - для установки атрибута disabled кнопке;

`` setImage(element: HTMLImageElement, src: string, alt?: string) `` - для установки картинки;


### Класс Page

Главная страница проекта, реализует методы работы с карточками.

Наследует класс Component<IPage>

Интерфейс IPage:

`` interface IPage {
  catalog: HTMLElement[];
} ``

Конструктор принимает такие аргументы:

`` container: HTMLElement `` - контейнер карточек;

`` events: HTMLElement `` - события;

Методы: 

`` set `` - для отрисовки страницы, установки значений;

Другие аргументы:

`` catalog: HTMLElement `` - каталог карточек;

`` basket: HTMLElement `` - корзина;

`` wrapper: HTMLElement `` - корзина;

`` basket: HTMLElement `` - корзина;


### Класс Card

Карточка товара, можно открывать ее модальное окно.

Наследует Component с интерфейсом ICard<T>.

Интерфейсы:

`` export interface ICardActions {
  onClick: (event: MouseEvent) => void;
} ``

`` export interface ICard<T> {
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  chosen: boolean
  index: number
} ``

Конструктор принимает такие аргументы:

`` blockName: string `` - имя блока;

`` container: HTMLElement `` - описание карточки;

`` actions?: ICardActions `` - описание карточки;

Другие аргументы:

`` title: HTMLElement `` - загаловок карточки;

`` description: HTMLElement `` - описание карточки;

`` price: HTMLElement `` - цена карточки;

`` category: HTMLElement `` - категория карточки;

`` image: HTMLImageElement `` - картинка карточки;

`` button?: HTMLButtonElement `` - кнопка карточки;

Методы: 

`` set `` - для установки значений;

`` get `` - для получения значений;


### Класс Modal

Модальное окно.

Наследует Component с интерфейсом IModalData.

`` interface IModalData {
  content: HTMLElement;
} ``

Конструктор принимает такие аргументы:

`` container: HTMLElement `` - контейнер карточек;

`` events: HTMLElement `` - события;

Другие аргументы:

`` closeButton: HTMLButtonElement`` - кнопка закрытия модального окна;

`` content: HTMLElement `` - контент карточки;

Методы: 

`` set `` - для установки значений;

`` close() `` - для закрытия модального окна;

`` open() `` - для открытия модального окна;

`` render(data: IModalData) `` - ренедрит контент для модального окна;


### Класс Basket

Контент корзины

Наследует класс Component с интерфейсом IBasketView:

`` export interface IBasketView {
  items: HTMLElement[];
  total: string;
  selected: string[];
} ``

Конструктор принимает такие аргументы:

`` container: HTMLElement`` - составляющий компонент корзины;

`` events: EventEmitter `` - события в корзине;

Методы: 

`` set `` - для установки значений;

`` disableButton() `` - устанавливает для кнопки атрибут disabled;

`` resetIndex() `` - переустанавливает индекс товара в корзине (после удаления);

Другие аргументы:

`` list: HTMLElement `` - список товаров;

`` total: number `` - итоговая стоимость;

`` button: HTMLButtonElement `` - кнопка оформления заказа;

### Класс BasketItem

Карточка товара в корзине.

Наследует класс Component с интерфейсом IBasketItem:

`` interface IBasketItem {
  title: string;
  price: string;
  index: number;
} ``

Конструктор принимает такие аргументы:

`` container: HTMLElement`` - составляющий компонент корзины;

`` actions?: ICardActions `` - события в корзине;

Методы: 

`` set `` - для установки значений;

Другие аргументы:

`` title: HTMLElement `` - название карточки;

`` button?: HTMLButtonElement `` - кнопка удаления карточки;

`` price: HTMLElement `` - стоимость карточки;

`` index: HTMLElement `` - индекс карточки в корзине;


### Класс Form

Проверка валидности формы.

Наследует Component с интерфейсом IFormState:

`` interface IFormState {
  valid: boolean;
  errors: string[];
} ``

Конструктор принимает такие аргументы:

`` container: HTMLFormElement`` - составляющий компонент;

`` events: IEvents `` - события в форме;

Методы: 

`` set `` - для установки значений;

`` render(state: Partial<T> & IFormState) `` - рендерит контент в контейнере

Другие аргументы:

`` submit: HTMLButtonElement `` - кнопка submit;

`` errors: HTMLElement `` - хранит текст ошибки;


### Класс Success

Окно об успешной отправке формы

Наследует Component с интерфейсом ISuccess:

`` interface ISuccess {
  description: number;
} ``

`` interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
} ``

Конструктор принимает такие аргументы:

`` blockName: string`` - название блока;

`` container: HTMLElement`` - составляющий компонент;

`` events `` - события в окне;

Другие аргументы:

`` description: HTMLElement `` - итогвая стоимость, сколько было списано;

`` button: HTMLButtonElement `` - кнопка для возвращения на главную;

### Класс CardItem

Класс карточки, наследует класс Model с типом ICard:

`` export interface ICardItem {
  id: string;
  title: string;
  description: string; 
  category: string;
  image: string;
  price: number;
  chosen: boolean
}``

``export type ICard = ICardItem; ``

### Класс Order

Форма с адресом и способом оплаты

Наследует Form с интерфейсом IOrder:

`` interface IOrder {
  address: string;
  payment: string;
} ``

Конструктор принимает такие аргументы:

`` blockName: string`` - название блока;

`` container: HTMLElement`` - составляющий компонент;

`` events `` - события в окне;

Другие аргументы:

`` card: HTMLButtonElement `` - способ оплаты картой;

`` cash: HTMLButtonElement `` - способ оплаты наличными;


### Класс Contacts

Форма с телефоном и почтой

Наследует Form с интерфейсом IContacts:

`` interface IContacts {
  email: string;
  phone: string;
} ``

Конструктор принимает такие аргументы:

`` container: HTMLElement`` - составляющий компонент;

`` events `` - события в окне;


### Класс AppState

Класс содержит методы для работы с данными карточек, корзины

Наследует Model с интерфейсом IAppState:

`` catalog: ICard[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
}``

Аргументы:

`` basket: CardItem[] = [] `` - корзина;

`` catalog: CardItem[] `` - каталог товаров;

`` order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  }; `` - формы заказа;

``preview: string | null `` - превью карточки;

`` formErrors: FormErrors = {} `` - ошибки;

``productLine: CardItem[] `` - каталог;

## Model

Слой между сервером и интерфейсом

### Класс Api

Взаимодействие с сервером

Конструктор принимает такие аргументы:

`` baseUrl: string`` - куда отправить запрос;

`` options`` - настройки запроса;

Методы:

`` get(uri: string) `` - получить данные с сервера;

`` post(uri:string) `` - отправить данные на сервер;

`` handleResponse `` - проверяем, что запрос прошел успешно;

### Класс SaleApi

Отправка данных на сервер при покупке

Наследует класс Api.

Интерфейс: 

`` export interface ISaleApi {
  getCardsList: () => Promise<ICard[]>;
  getCardItem: (id: string) => Promise<ICard>;
} ``

Конструктор принимает такие аргументы:

`` baseUrl: string`` - куда отправить запрос;

`` options`` - настройки запроса;

Методы:

`` getSomething(uri: string) `` - запросы, чтобы получить данные с сервера;

`` post(uri:string) `` - отправить данные на сервер;
