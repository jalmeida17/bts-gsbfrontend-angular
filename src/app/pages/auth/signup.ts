import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LayoutService } from '../../layout/service/layout.service';
import { AuthService, SignupRequest } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],    template: `
        <app-floating-configurator />
        <p-toast></p-toast>
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden flex-col gap-5">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="layout-topbar-logo-container" style="gap: 5px;">
                                <img src="assets/{{layoutService.isDarkTheme() ? 'gsb_dark' : 'gsb_light'}}.png" alt="logo" style="width: 50px; height: auto;" class="flex items-center justify-center mx-auto mb-4 -mt-10" />
                            </div>
                         
                            <span class="text-muted-color font-medium">Create your account to continue</span>
                        </div>

                        <div>
                            <label for="name1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
                            <input pInputText id="name1" type="text" placeholder="Name" class="w-full md:w-[30rem] mb-8" [(ngModel)]="username" />

                            <label for="phone1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Phone number</label>
                            <input pInputText id="phone1" type="text" placeholder="Phone number" class="w-full md:w-[30rem] mb-8" [(ngModel)]="phonenum" />

                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password"  [toggleMask]="true" styleClass="w-full md:w-[30rem] mb-8 -mr-5" [fluid]="true" [feedback]="false"></p-password>

                            <p-button label="Create Account" styleClass="w-full mt-4" [loading]="isLoading" (onClick)="onSignup()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
            <label class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">The Backend is hosted on Render, this might take some time.</label>
        </div>
    `
})
export class Signup {

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    email: string = '';
    password: string = '';
    username: string = '';
    phonenum: string = '';
    checked: boolean = false;
    isLoading: boolean = false;

    onSignup(): void {
        if (!this.validateForm()) {
            return;
        }

        this.isLoading = true;

        const signupRequest: SignupRequest = {
            name: this.username,
            email: this.email,
            password: this.password,
            role: 'user' // Default role for new users
        };

        this.authService.signup(signupRequest).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Account created successfully! Please login to continue.'
                });
                
                // Redirect to login page after successful signup
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);
            },
            error: (error) => {
                this.isLoading = false;
                let errorMessage = 'Failed to create account. Please try again.';
                
                if (error.error?.message) {
                    errorMessage = error.error.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage
                });
            }
        });
    }

    private validateForm(): boolean {
        if (!this.username.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter your name'
            });
            return false;
        }

        if (!this.email.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter your email'
            });
            return false;
        }

        if (!this.isValidEmail(this.email)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a valid email address'
            });
            return false;
        }

        if (!this.password.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a password'
            });
            return false;
        }

        if (this.password.length < 6) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Password must be at least 6 characters long'
            });
            return false;
        }

        return true;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
