import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
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



                            <p-button label="Create Account" styleClass="w-full mt-4" routerLink="/dashboard"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Signup {

    constructor(public layoutService: LayoutService) {}

    email: string = '';

    password: string = '';

    username: string = '';

    phonenum: string = '';

    checked: boolean = false;
}
