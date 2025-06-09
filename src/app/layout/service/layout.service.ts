import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface layoutConfig {
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    darkTheme?: boolean;
    menuMode?: string;
}

interface LayoutState {
    staticMenuDesktopInactive?: boolean;
    overlayMenuActive?: boolean;
    configSidebarVisible?: boolean;
    staticMenuMobileActive?: boolean;
    menuHoverActive?: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

/**
 * LayoutService - Manages PrimeNG theme configuration with localStorage persistence
 * 
 * Features:
 * - Automatically saves theme preferences (dark/light mode, colors, etc.) to localStorage
 * - Restores theme configuration on page refresh/reload
 * - Applies dark mode class to document element immediately on load
 * - Provides methods to clear saved preferences if needed
 */
@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private readonly THEME_STORAGE_KEY = 'layout-config';

    _config: layoutConfig = {
        preset: 'Aura',
        primary: 'noir',
        surface: null,
        darkTheme: false,
        menuMode: 'static'
    };

    _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    layoutConfig = signal<layoutConfig>(this._config);

    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<layoutConfig>();

    private overlayOpen = new Subject<any>();

    private menuSource = new Subject<MenuChangeEvent>();

    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();

    resetSource$ = this.resetSource.asObservable();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    theme = computed(() => (this.layoutConfig()?.darkTheme ? 'light' : 'dark'));

    isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    getPrimary = computed(() => this.layoutConfig().primary);

    getSurface = computed(() => this.layoutConfig().surface);

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);

    private initialized = false;

    constructor() {
        // Load saved theme configuration from localStorage
        this.loadThemeFromStorage();

        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
            // Save theme configuration whenever it changes
            this.saveThemeToStorage(config);
        });
    }

    private handleDarkModeTransition(config: layoutConfig): void {
        if ((document as any).startViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: layoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready
            .then(() => {
                this.onTransitionEnd();
            })
            .catch(() => {});
    }

    toggleDarkMode(config?: layoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({ ...prev, overlayMenuActive: !this.layoutState().overlayMenuActive }));

            if (this.layoutState().overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({ ...prev, staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive }));
        } else {
            this.layoutState.update((prev) => ({ ...prev, staticMenuMobileActive: !this.layoutState().staticMenuMobileActive }));

            if (this.layoutState().staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    /**
     * Save theme configuration to localStorage
     */
    private saveThemeToStorage(config: layoutConfig): void {
        try {
            localStorage.setItem(this.THEME_STORAGE_KEY, JSON.stringify(config));
        } catch (error) {
            console.warn('Failed to save theme configuration to localStorage:', error);
        }
    }

    /**
     * Load theme configuration from localStorage
     */
    private loadThemeFromStorage(): void {
        try {
            const savedConfig = localStorage.getItem(this.THEME_STORAGE_KEY);
            if (savedConfig) {
                const parsedConfig: layoutConfig = JSON.parse(savedConfig);
                
                // Merge saved config with default config to ensure all properties exist
                this._config = { ...this._config, ...parsedConfig };
                this.layoutConfig.set(this._config);
                
                // Apply the dark theme immediately if it was saved
                if (this._config.darkTheme) {
                    document.documentElement.classList.add('app-dark');
                } else {
                    document.documentElement.classList.remove('app-dark');
                }
            }
        } catch (error) {
            console.warn('Failed to load theme configuration from localStorage:', error);
        }
    }

    /**
     * Clear saved theme configuration
     */
    clearThemeStorage(): void {
        try {
            localStorage.removeItem(this.THEME_STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear theme configuration from localStorage:', error);
        }
    }
}
