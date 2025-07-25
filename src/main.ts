import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// const savedDark = localStorage.getItem('darkMode') === 'true';
// if (savedDark) {
//   document.documentElement.classList.add('my-app-dark');
// }

