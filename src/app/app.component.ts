import { Component, inject, OnInit } from '@angular/core';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { AuthService } from './core/services/auth/auth.service';
import { Router } from '@angular/router';
import {
  homeOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  enterOutline,
  personAddOutline,
  bugOutline,
} from 'ionicons/icons';


addIcons({
  homeOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  enterOutline,
  personAddOutline,
  bugOutline,
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [LeftMenuComponent, IonicModule],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    await this.authService.init();

    const token = await this.authService.getToken();
    if (token) {
      this.router.navigate(['/product']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
