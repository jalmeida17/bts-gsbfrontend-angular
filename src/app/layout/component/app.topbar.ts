import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user.model';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    styleUrls: ['./app.topbar.scss'],
    templateUrl: './app.topbar.html',
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    currentUser: UserModel | null = null;
    activeLanguage: any;    

    availableLanguages = [
        { label: 'English', value: 'en' },
        { label: 'Français', value: 'fr' },
        { label: 'Italiano', value: 'it' },
        { label: 'Español', value: 'es' },
        { label: 'Português', value: 'pt' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Русский', value: 'ru' }
    ]

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        public readonly translocoService: TranslocoService
    ) {}    ngOnInit() {
        // Initialize active language after service is available
        this.activeLanguage = this.getActiveLanguage();
        
        if (this.authService.isAuthenticated()) {
            this.userService.getCurrentUser().subscribe({
                next: (user) => {
                    this.currentUser = user;
                },
                error: (error) => {
                    console.error('Error fetching user profile:', error);
                }
            });
        }
    }toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        localStorage.setItem('lang', 'en');
    }

    getCapitalizedName(): string {
        if (!this.currentUser?.name) {
            return 'Loading...';
        }
        return this.currentUser.name.charAt(0).toUpperCase() + this.currentUser.name.slice(1);
    }    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    selectLanguage(lang: string) {
        this.activeLanguage = this.availableLanguages.find(l => l.value === lang);
        this.translocoService.setActiveLang(lang);
    }

    getActiveLanguage() {
        return this.availableLanguages.find(lang => lang.value === this.translocoService.getActiveLang());
    }
}
