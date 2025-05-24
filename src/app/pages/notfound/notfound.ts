import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    template: ` <app-floating-configurator />
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
                    
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <div class="layout-topbar-logo-container" style="gap: 5px;">
                            <img src="assets/{{layoutService.isDarkTheme() ? 'gsb_dark' : 'gsb_light'}}.png" alt="logo" style="width: 50px; height: auto;" class="flex items-center justify-center mx-auto mb-6 -mt-10" />
                        </div>
                        <span class="text-primary font-bold text-3xl">404</span>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                        <div class="text-surface-600 dark:text-surface-200 mb-8">Requested resource is not available.</div>

                        <p-button label="Go to Dashboard" routerLink="/dashboard" />
                    </div>
                </div>
            </div>
        </div>`
})
export class Notfound {

    constructor(public layoutService: LayoutService) { }
}
