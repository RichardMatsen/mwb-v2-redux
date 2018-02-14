import { ProfileComponent } from './profile.component';
import { LoginComponent } from './login.component';
import { AuthguardService } from '../nav/authguard.service';

export const userRoutes = [
  { path: 'profile', canActivate: [AuthguardService], component: ProfileComponent, data: {toastrPrompt: 'User Profile'} },
  { path: 'login', component: LoginComponent },

];
