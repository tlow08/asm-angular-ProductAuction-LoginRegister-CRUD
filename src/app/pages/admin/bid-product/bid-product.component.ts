import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BidService } from '../../../services/bid.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bid-product',
  imports: [NgIf, NgFor, DatePipe, FormsModule],
  standalone: true,
  templateUrl: './bid-product.component.html',
  styleUrls: ['./bid-product.component.css'],
})
export class BidProductComponent implements OnInit {
  bids: any[] = []; 
  @Input() productId: string | null = null;

  @Output() winnerDeclared = new EventEmitter<any>();
  winner: any = null;

  bidService = inject(BidService);
  route = inject(ActivatedRoute);
  toast = inject(HotToastService);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['productId']; 
      if (this.productId) {
        this.loadBids(this.productId as string);
      }
    });
  }

  loadBids(productId: string) {
    this.bidService.getBidsForProduct(productId).subscribe({
      next: (data) => {
        this.bids = data; 
        this.sortBidsByHighestAmount();
      },
      error: (error) => {
        this.toast.error('Error: ' + error.message); 
      },
    });
  }

  sortBidsByHighestAmount() {
    this.bids.sort((a, b) => b.bidAmount - a.bidAmount); 
  }

  isHighestBidder(bid : any): boolean{
    return bid.bidAmount === (this.bids.length ? this.bids[0].bidAmount : 0);
  }

  declareWinner(bid: any){
    console.log(bid);
    if (this.productId) {
      this.bidService.saveWinner(this.productId, bid).subscribe({
        next: () => {
          this.winner = bid;
          console.log(this.winner);
          this.toast.success('Winner declared successfully!');
          this.winnerDeclared.emit(bid);
          this.loadBids(this.productId!);
        },
        error: (error) => {
          this.toast.error('Error: ' + error.message);
        },
      });
    }
  }
}
