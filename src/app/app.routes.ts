import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'الرئيسية',
    loadComponent: () => import('./pages/accueil/accueil').then((m) => m.Accueil),
  },
  {
    path: 'a-propos',
    title: 'من نحن',
    loadComponent: () => import('./pages/a-propos/a-propos').then((m) => m.APropos),
  },
  {
    path: 'services',
    title: 'خدماتنا',
    loadComponent: () => import('./pages/services/services-page').then((m) => m.ServicesPage),
  },
  {
    path: 'realisations',
    title: 'أعمالنا',
    loadComponent: () =>
      import('./pages/realisations/realisations-page').then((m) => m.RealisationsPage),
  },
  {
    path: 'contact',
    title: 'اتصل بنا',
    loadComponent: () => import('./pages/contact/contact-page').then((m) => m.ContactPage),
  },
  {
    path: 'login',
    title: 'تسجيل الدخول',
    loadComponent: () => import('./pages/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    title: 'الصفحة غير موجودة',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
