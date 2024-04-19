import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { SaleApi } from './components/CardsApi';
import { AppState, CardItem, CatalogChangeEvent } from './components/AppData';
import { Card, CatalogItem } from './components/Card';
import { BasketItem, Basket } from './components/common/Basket';



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

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// переиспользуется
const basket = new Basket(cloneTemplate(basketTemplate), events);



// Бизнес-логика
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
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
  //console.log(page)
})

// открыть карточку
events.on('card:select', (item: CardItem) => {
  appData.setPreview(item);
})

// открыть корзину
events.on('basket:open', () => {
  modal.render({content: basket.render()})
})

// изменения в корзине
events.on('basket:changed', () => {
  let total = 0;
  console.log(appData.getClosedCards())
  basket.total = total;
})

events.on('preview:changed', (item: CardItem) => {
  const showItem = (item: CardItem) => {
    const card = new CatalogItem(cloneTemplate(cardPreviewTemplate));
    modal.render({
      content: card.render({
        title: item.title,
        image: item.image,
        description: item.description,
        price: item.price,
        category: item.category,
        status: item.status
      })
    })
    console.log(item.status)
  }
  // открытие модального окна
  if (item) {
    api.getCardItem(item.id)
      .then((result) => {
        item.title = result.title;
        item.description = result.description;
        item.image = result.image;
        item.price = result.price;
        item.category = result.category;
        // item.status = 'active';
        showItem(item);
      })
      .catch((err) => {
        console.error(err);
      })
  } else {
    modal.close();
  }

  


})




// Блокируем прокрутку страницы если открыта модалка
// events.on('modal:open', () => {
//   page.locked = true;
// });

// Получаем карточки с сервера
api.getCardsList()
  // .then(res => console.log(console.log(res)))
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.log(err);
  })

