import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Product } from '../home-page/home-page.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BidService } from '../../services/bid.service';
import { FormsModule } from '@angular/forms';
import { BidProductComponent } from "../admin/bid-product/bid-product.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule, RouterLink, BidProductComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  product: Product | null = null;
  bidAmount: number = 0;
  bidHistory: any[] = [];
  isAuctionActive: boolean = false;
  winner: any | null = null;

  productService = inject(ProductService);
  bidService = inject(BidService);
  route = inject(ActivatedRoute);
  toast = inject(HotToastService);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.productService.getProductDetail(productId).subscribe({
          next: (data) => {
            this.toast.success('Successfully!');
            this.product = data.data;

            this.checkAuctionStatus();
            this.loadBidHistory(productId);
          },
          error: (error) => {
            console.log(error.message);
            this.toast.error('Error: ' + error.message);
          },
        });
      }
    });
  }

  checkAuctionStatus() {
    if (this.product) {
      const currentTime = new Date();
      const startTime = new Date(this.product.startAt);
      const endTime = new Date(this.product.endAt);

      this.isAuctionActive = currentTime >= startTime && currentTime <= endTime;
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  placeBid() {
    if (!this.product) {
      this.toast.error('Sản phẩm không có sẵn');
      return;
    }

    const productId = this.product._id;
    if (!productId) {
      this.toast.error('Product ID is missing');
      return;
    }
    
    if (!this.isAuctionActive) {
      this.toast.error("Hết thời gian tham gia đấu giá");
      return;
    }

    if (this.bidAmount <= (this.product.currentBidPrice || 0)) {
      this.toast.error('Giá thầu phải lớn hơn giá thầu hiện tại.');
      return;
    }

    this.bidService.placeBid(this.product._id, this.bidAmount).subscribe({
      next: (data) => {
        this.toast.success('Đã đặt giá thầu thành công!');
        if (this.product) {
          this.product.currentBidPrice = this.bidAmount;
        }
        this.loadBidHistory(productId);
        this.bidAmount = 0;
        location.reload();
      },
      error: (error) => {
        console.error('Error placing bid:', error.message); 
        // this.toast.error('Error: ' + (error.error?.message || error.message));
      },
    });
  }

  loadBidHistory(productId: string) {
    this.bidService.getBidsForProduct(productId).subscribe({
      next: (data) => {
        this.bidHistory = data.sort((a:{ createdAt: string }, b:{ createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log(data);
      },
      error: (error) => {
        // this.toast.error('Error' + error.message);
        console.log(error.message)
      },
    });
  }
  updateWinner(winner: any) {
    this.winner = winner;
  }
}
