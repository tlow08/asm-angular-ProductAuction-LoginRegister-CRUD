import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidProductComponent } from './bid-product.component';

describe('BidProductComponent', () => {
  let component: BidProductComponent;
  let fixture: ComponentFixture<BidProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BidProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
