export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _unityPrice: number;
  private _quantity: number;


  constructor(
    id: string,
    name: string,
    unityPrice: number,
    productId: string,
    quantity: number
  ) {
    this._id = id;
    this._name = name;
    this._unityPrice = unityPrice;
    this._productId = productId;
    this._quantity = quantity;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._unityPrice * this._quantity;
  }

  get unityPrice() : number {
    return this._unityPrice;
  }
}
