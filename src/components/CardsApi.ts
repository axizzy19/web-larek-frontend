import { Api, ApiListResponse } from "./base/api";
import { ICard } from '../types/index';

export interface ISaleApi {
  getCardsList: () => Promise<ICard[]>;
  getCardItem: (id: string) => Promise<ICard>;

}

export class SaleApi extends Api implements ISaleApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getCardsList(): Promise<ICard[]> {
    return this.get(`/product`).then((data: ApiListResponse<ICard>) => 
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  }
  

  getCardItem(id: string): Promise<ICard> {
    return this.get(`/product/${id}`).then(
      (item: ICard) => ({
        ...item,
        image: this.cdn + item.image,
      })
    );
  }

}