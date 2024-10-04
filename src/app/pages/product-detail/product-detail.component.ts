import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Product } from '../home-page/home-page.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: Product | null = null;
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  toast = inject(HotToastService);
  ngOnInit(){
    this.route.params.subscribe((params)=>{
      const productId = params['id'];
      if(productId){
      console.log(productId);
        this.productService.getProductDetail(productId).subscribe({
          next:(data)=>{
            this.toast.success("Successfully!");
            this.product = data.data;
          },
          error: (error)=>{
            console.log(error.message);
            this.toast.error("Error: " + error.message);
          }
        })
      }
    })
  }
}
