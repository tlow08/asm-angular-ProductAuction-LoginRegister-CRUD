import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderAdminComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
