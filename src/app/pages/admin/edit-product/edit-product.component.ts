import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, CategoryService } from '../../../services/category.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {
  editForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(6)]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    image: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    
    startAt: new FormControl('', [Validators.required]),
    endAt: new FormControl('', [Validators.required]),
    currentBidPrice: new FormControl(0, [Validators.min(0)]),
  });

  productService = inject(ProductService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  productId!: string;
  categoryService = inject(CategoryService);
  categories: Category[] = [];
  toast = inject(HotToastService);

  ngOnInit() {
    this.fetchCategories(); 
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.productService.getProductDetail(params['id']).subscribe({
        next: (data) => {
          this.editForm.patchValue({
            title: data.data.title,
            description: data.data.description,
            price: data.data.price,
            image: data.data.image,
            category: data.data.category,
            
            // Load auction-related fields
            startAt: data.data.startAt ? new Date(data.data.startAt).toISOString().slice(0, -1) : '',
            endAt: data.data.endAt ? new Date(data.data.endAt).toISOString().slice(0, -1) : '',
            currentBidPrice: data.data.currentBidPrice || 0,
          });
        },
        error: (error) => {
          this.toast.error(error.message);
        },
      });
    });
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (Array.isArray(response.data)) {
          this.categories = response.data;
        } else {
          this.categories = [];
        }
      },
      error: (error) => {
        this.categories = [];
      },
    });
  }
  handleSubmit() {
    if (this.editForm.invalid) {
        this.toast.error('Please fill in all required fields');
        return;
    }
    
    if (this.editForm.value.endAt < this.editForm.value.startAt) {
        this.toast.error('End time cannot be before start time.');
        return;
    }

    // Prepare form data for submission
    const formValue = {
        ...this.editForm.value,
        startAt: new Date(this.editForm.value.startAt).toISOString(),
        endAt: new Date(this.editForm.value.endAt).toISOString(),
    };

    console.log('Submitting form value:', formValue); // Log form value for debugging

    this.productService.editProduct(this.productId, formValue).subscribe({
        next: () => {
            this.toast.success('Product updated successfully!');
            this.router.navigateByUrl('/admin/product/list');
        },
        error: (error) => {
            console.error('Error updating product:', error); // Log the error for debugging
            this.toast.error('Error: ' + error.message);
        },
    });
}

  
  // handleSubmit() {
  //   if (this.editForm.invalid) {
  //     this.toast.error('Nhập đủ các trường thông tin');
  //     return;
  //   }
  //   if (this.editForm.value.endAt < this.editForm.value.startAt) {
  //     this.toast.error('End time cannot be before start time.');
  //     return;
  //   }
  //   this.productService.editProduct(this.productId, this.editForm.value).subscribe({
  //     next: () => {
  //       this.toast.success('Product updated successfully!');
  //       this.router.navigateByUrl('/admin/product/list');
  //     },
  //     error: (error) => {
  //       this.toast.error('Error: ' + error.message);
  //     },
  //   });
  // }

  // Getters for form controls
  get title() { return this.editForm.get('title'); }
  get description() { return this.editForm.get('description'); }
  get price() { return this.editForm.get('price'); }
  get image() { return this.editForm.get('image'); }
  get category() { return this.editForm.get('category'); }
  get startAt() { return this.editForm.get('startAt'); }
  get endAt() { return this.editForm.get('endAt'); }
  get currentBidPrice() { return this.editForm.get('currentBidPrice'); }
}
