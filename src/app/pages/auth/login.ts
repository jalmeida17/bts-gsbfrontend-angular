import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LayoutService } from '../../layout/service/layout.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, MessageModule],
    template: `
        <app-floating-configurator />
        
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="layout-topbar-logo-container" style="gap: 5px;">
                                <img src="assets/{{layoutService.isDarkTheme() ? 'gsb_dark' : 'gsb_light'}}.png" alt="logo" style="width: 50px; height: auto;" class="flex items-center justify-center mx-auto mb-4 -mt-10" />
                            </div>
                         
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div *ngIf="errorMessage" class="mb-4">
                                <p-message severity="error" [text]="errorMessage"></p-message>
                            </div>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                               
                            </div>
                            <div class="flex flex-row gap-4 justify-center ">
                                <p-button 
                                    label="Sign In" 
                                    styleClass="w-full" 
                                    [loading]="isLoading"
                                    (click)="onLogin()">
                                </p-button>
                                <p-button label="Create Account" styleClass="w-full" routerLink="/signup"></p-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {}

    email: string = '';
    password: string = '';
    checked: boolean = false;
    isLoading: boolean = false;
    errorMessage: string = '';

    onLogin(): void {
        if (!this.email || !this.password) {
            this.errorMessage = 'Please enter both email and password';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login({ email: this.email, password: this.password })
            .subscribe({
                next: (response) => {
                    console.log('Login successful', response);
                    this.isLoading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('Login failed', error);
                    this.isLoading = false;
                    this.errorMessage = error.error?.message || 'Login failed. Please try again.';
                }
            });
    }
}
