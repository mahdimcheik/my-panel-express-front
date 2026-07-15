import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'لوحة التحكم',
        loadComponent: () => import('./dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'services',
        title: 'إدارة الخدمات',
        loadComponent: () =>
          import('./services/services-admin-page').then((m) => m.ServicesAdminPage),
      },
      {
        path: 'services/new',
        title: 'خدمة جديدة',
        loadComponent: () => import('./services/service-form-page').then((m) => m.ServiceFormPage),
      },
      {
        path: 'services/:id',
        title: 'تعديل الخدمة',
        loadComponent: () => import('./services/service-form-page').then((m) => m.ServiceFormPage),
      },
      {
        path: 'realisations',
        title: 'إدارة الأعمال',
        loadComponent: () =>
          import('./realisations/realisations-admin-page').then((m) => m.RealisationsAdminPage),
      },
      {
        path: 'realisations/new',
        title: 'عمل جديد',
        loadComponent: () =>
          import('./realisations/realisation-form-page').then((m) => m.RealisationFormPage),
      },
      {
        path: 'realisations/:id',
        title: 'تعديل العمل',
        loadComponent: () =>
          import('./realisations/realisation-form-page').then((m) => m.RealisationFormPage),
      },
      {
        path: 'horaires',
        title: 'أوقات العمل',
        loadComponent: () => import('./horaires/horaires-admin-page').then((m) => m.HorairesAdminPage),
      },
      {
        path: 'parametres',
        title: 'إعدادات الموقع',
        loadComponent: () =>
          import('./parametres/parametres-admin-page').then((m) => m.ParametresAdminPage),
      },
    ],
  },
];
