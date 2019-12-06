import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { OrderProduct } from '../models/order-product';
import { OrderCreate } from '../models/order-create';
import { OrderProductCreate } from '../models/order-product-create';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = 'https://localhost:44389/api/orders';

  constructor(private http: HttpClient) { }

  getOrdersByUserId(userId:number) {
    return this.http.get<Order[]>(this.ordersUrl+"?userId="+userId);
  }

  createOrder(orderCreate: OrderCreate) {
    return this.http.post<Order>(this.ordersUrl, orderCreate);
  }

  createOrderProduct(orderId:number,orderProductCreate: OrderProductCreate) {
    return this.http.post<OrderProduct>(this.ordersUrl + "/" + orderId + "/products", orderProductCreate);
  }

  getOrder(orderId: number) {
    return this.http.get<Order>(this.ordersUrl + "/" + orderId);
  }

  getOrderDetail(orderId: number) {
    return this.http.get<OrderProduct[]>(this.ordersUrl + "/" + orderId + "/products");
  }
}
