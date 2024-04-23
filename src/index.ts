import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { SaleApi } from './components/CardsApi';
import { AppState, CardItem, CatalogChangeEvent } from './components/AppData';
import { Card } from './components/Card';
import { BasketItem, Basket } from './components/common/Basket';
import { Order } from './components/Order'
import { IOrderForm, ApiResponse } from './types';
import { Contacts } from './components/Contacts'
import { Success } from './components/Success'

const events = new EventEmitter();
const api = new SaleApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); // ? #card-catalog
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// переиспользуется
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close()
  }
});

// Бизнес-логика
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit(`card:select`, item)
    });
    
    // отрисовалась карточка
    return card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price,
      category: item.category
    })
  })
})

// открытая карточка
events.on('card:select', (item: CardItem) => {
  page.locked = true;
  appData.setPreview(item);
  const card = new Card('card', cloneTemplate(cardPreviewTemplate)) // item:add
})

// добавление товара в корзину
events.on('item:add', (item: CardItem) => {
  item.chosen = true;
  appData.addToBasket(item);
  page.counter = appData.getBasketAmount();
  modal.close();
})

// удаление товара из корзины
events.on('item:delete', (item: CardItem) => {
  appData.removeFromBasket(item.id);
  item.chosen = false;
  basket.total = appData.getBasketTotal();
  page.counter = appData.getBasketAmount();
  basket.resetIndex();
  events.emit('basket:changed')
  if (!appData.basket.length) {
    basket.disableButton();
  }
})

// изменения в корзине
events.on('basket:changed', () => {
  page.locked = true;
  const basketItems = appData.basket.map((item, index) => {
    const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('item:delete', item)
      }
    });
    return basketItem.render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  });
  modal.render({
    content: basket.render({
      items: basketItems,
      total: String(appData.getBasketTotal())
    })
  })
})

events.on('preview:changed', (item: CardItem) => {
  const showItem = (item: CardItem) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        events.emit('item:add', item)
      }
    });
    modal.render({
      content: card.render({
        title: item.title,
        image: item.image,
        description: item.description,
        price: item.price,
        category: item.category,
      })
    })
  }

  if (item) {
    api.getCardItem(item.id)
      .then((result) => {
        item.description = result.description;
        showItem(item);
      })
      .catch((err) => {
        console.error(err);
      })
  } else {
     modal.close();
  }
})

// открытие первого окна оформления
events.on('basket:order', () => {
  modal.render({
    content: order.render({
      address: '',
      valid: false,
      errors: []
    })
  })
})

// изменение ввода данных
events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// изменение ошибок в order
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// изменение ошибок в contacts
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// закрытие order, переход к contacts
events.on('order:submit', () => {
  appData.order.total = appData.getBasketTotal();
  appData.setItems();
  modal.render({
    content: contacts.render({
      valid: false,
      errors: []
    })
  })
})

// отправляем на сервер
events.on('contacts:submit', () => {
  api.post(`/order`, appData.order)
    .then((res) => {
      events.emit('order:success', res);
      appData.clearBasket();
      appData.refreshOrder();
      page.counter = 0;
    })
})

// окно об успешной покупке
events.on('order:success', (res: ApiResponse<string>) => {
  modal.render({
    content: success.render({
      description: res.total
    })
  })
})

// Закрытие модального окна
events.on('modal:close', () => { 
  appData.refreshOrder()
  page.locked = false
})

//Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// Получаем карточки с сервера
api.getCardsList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.log(err);
  })

