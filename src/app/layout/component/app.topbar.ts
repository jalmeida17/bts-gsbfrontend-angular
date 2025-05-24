import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    styleUrls: ['./app.topbar.scss'],
    template: ` <div class="layout-topbar">
    
        <div class="layout-topbar-logo-container" style="gap: 5px;">
            <img src="assets/{{layoutService.isDarkTheme() ? 'gsb_dark' : 'gsb_light'}}.png" alt="logo" style="width: 50px; height: auto;">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu -mr-5">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">

                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <div class="user-profile-container">
                        <button type="button" class="layout-topbar-action" routerLink="/profile">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <div class="user-profile-dropdown">
                            <div class="inside-user-profile">
                                <div class="user-profile-header">
                                    <i class="pi pi-user"></i>
                                    <span>Joao Miguel Almeida Santos</span>
                                </div>
                                <div class="user-profile-email">
                                    <span>{{"joa.almeidasantos@gmail.com"}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
