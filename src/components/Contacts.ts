import { IEvents } from './base/events';
import { Form } from './common/Form'

interface IContacts {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)
  }
}