import { Component, OnInit, Input, Inject } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ProductService } from '../../../../services/product.service';
import { OrderProductEditViewModel } from './edit.viewmodel';
import { OrderService } from 'src/app/ordermanager/services/order.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';
import { OrderProductCreate } from 'src/app/ordermanager/models/order-product-create';
import { FormControl } from '@angular/forms';
import { Product } from 'src/app/ordermanager/models/product';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-order-product-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class OrderProductEditComponent implements OnInit {
  @Input() ViewModel: OrderProductEditViewModel = new OrderProductEditViewModel();
  productCtrl = new FormControl();
  filteredProducts: Observable<Product[]>;
  displayedColumns = [
    'BrandDescription',
    'Description'
  ]

  constructor(
    private dialogRef: MatDialogRef<OrderProductEditComponent>,
    private productService: ProductService,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filteredProducts = this.productCtrl.valueChanges
      .pipe(
        startWith(''),
        map(product => product ? this._filterProducts(product) : this.ViewModel.Products.slice())
      );
  }

  ngOnInit() {
    forkJoin(
      this.productService.getProducts(),
      this.orderService.getOrder(this.data.orderId)
    ).subscribe(results => {
      this.ViewModel.Products = results[0];
      this.ViewModel.Order = results[1];
    });
  }

  save() {
    let orderProductCreate: OrderProductCreate = {
      ProductId: this.ViewModel.ProductId,
      Quantity: this.ViewModel.Quantity
    }

    this.orderService.createOrderProduct(this.ViewModel.Order.OrderId,orderProductCreate).subscribe(orderProduct => {
      this.dialogRef.close(orderProduct);
    });
  }

  dismiss() {
    this.dialogRef.close(null);
  }

  isDisabled(): boolean {
    return this.ViewModel.ProductId == 0 || this.ViewModel.Quantity == 0;
  }

  private _filterProducts(value: any): Product[] {
    let filterValue:string;

    if (typeof value == "object") {
      filterValue = (value as Product).Description;
    } else {
      filterValue = (value as string).toLowerCase();      
    }

    return this.ViewModel.Products.filter(product => product.Description.toLowerCase().includes(filterValue));
  }

  optionSelected(e:MatAutocompleteSelectedEvent) {
    this.ViewModel.ProductId = (e.option.value as Product).ProductId; 
  }

  displayFn(product?: Product): string | undefined {
    return product? product.Description : undefined;
  }

}
