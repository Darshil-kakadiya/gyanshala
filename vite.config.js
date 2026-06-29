import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        programs: resolve(__dirname, 'programs.html'),
        centers: resolve(__dirname, 'centers.html'),
        volunteer: resolve(__dirname, 'volunteer.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        faq: resolve(__dirname, 'faq.html'),
        // Dashboards
        adminDashboard: resolve(__dirname, 'admin-dashboard.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        teacherDashboard: resolve(__dirname, 'teacher-dashboard.html'),
        volunteerDashboard: resolve(__dirname, 'volunteer-dashboard.html'),
        // Auth
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        forgotPassword: resolve(__dirname, 'forgot-password.html'),
        resetPassword: resolve(__dirname, 'reset-password.html'),
      }
    }
  }
});
