import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { Category, CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  addForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(6)]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    image: new FormControl('', [Validators.required] ),
    category: new FormControl('', [Validators.required])
  });

  productService = inject(ProductService);
  router = inject(Router);
  categoryService = inject(CategoryService);
  categories: Category[] = [];
  toast = inject(HotToastService);
  ngOnInit() {
    this.fetchCategories(); 
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        console.log('API Response:', response); 
        if (Array.isArray(response.data)) { 
          this.categories = response.data; 
        } else {
          console.error('Unexpected response format:', response);
          this.categories = []; 
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.categories = []; 
      }
    });
  }
  get title(){
    return this.addForm.get('title');
  }
  get description(){
    return this.addForm.get('description');
  }
  get price(){
    return this.addForm.get('price');
  }
  get image(){
    return this.addForm.get('image');
  }
  get category(){
    return this.addForm.get('category');
  }
  handleSubmit(){
    if (this.addForm.invalid) {
      this.toast.error('Nhập đủ các trường thông tin');
      return;
    }
    this.productService.createProduct(this.addForm.value).subscribe({
      next: ()=>{
        this.toast.success("Thêm sản phẩm thành công!")
        this.router.navigateByUrl("/admin/product/list");
      },
      error: (error)=>{
        // alert("Error");
        this.toast.error("Error: " + error.message);
        console.log("Error" + error.message)
      }
    })
  }
}
