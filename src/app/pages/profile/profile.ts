import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CardModule,
        AvatarModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextarea,
        RippleModule,
        TabViewModule,
        ChipModule,
        DividerModule,
        BadgeModule,
        TagModule,
        ToastModule,
        FormsModule
    ],
    providers: [MessageService],
    template: `
        <p-toast></p-toast>
        <div class="grid">
            <div class="col-12">
                <div class="card profile-card mb-0 p-0">
                    <!-- Hero section with cover image -->
                    <div class="profile-cover-wrapper">
                        <div class="profile-cover"></div>
                        <div class="profile-menu">
                            <p-button icon="pi pi-pencil" (click)="showEditDialog()" styleClass="p-button-rounded p-button-text p-button-plain"></p-button>
                        </div>
                    </div>
                    
                    <!-- Profile header section -->
                    <div class="profile-header p-4">
                        <div class="flex flex-column md:flex-row align-items-center md:align-items-start">
                            <div class="profile-image-container">
                                <p-avatar image="https://coins.fr/wp-content/uploads/2024/01/bayc-cry-800x400.jpg" styleClass="profile-image" [style.width]="'150px'" [style.height]="'150px'" shape="circle"></p-avatar>
                                <div class="online-indicator"></div>
                            </div>
                            
                            <div class="profile-info ml-0 md:ml-4 mt-3 md:mt-0 text-center md:text-left flex-1">
                                <div class="flex flex-column md:flex-row md:align-items-center justify-content-between">
                                    <div></div>
                                    <div style="margin-top: 5rem;">
                                        <h1 class="mb-1">Alice Johnson</h1>
                                        <div class="mb-2 text-color-secondary">Software Engineer</div>
                                        <div class="flex align-items-center justify-content-center md:justify-content-start">
                                            <i class="pi pi-map-marker mr-1 text-sm"></i>
                                            <span class="text-sm">San Francisco, CA</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex gap-3 mt-4 justify-content-center md:justify-content-start">
                                    <p-tag value="Software Development" severity="info" styleClass="text-sm"></p-tag>
                                    <p-tag value="UX Design" severity="success" styleClass="text-sm"></p-tag>
                                    <p-tag value="Angular" severity="warning" styleClass="text-sm"></p-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p-divider></p-divider>
                    
                    <!-- Profile content -->
                    <div class="p-4">
                        <p-tabView styleClass="profile-tabs">
                            <p-tabPanel header="About">
                                <div class="grid">
                                    <div class="col-12 lg:col-8 xl:col-9">
                                        <div class="card mb-3">
                                            <h2>About Me</h2>
                                            <div class="text-color-secondary line-height-3 mb-4">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                            </div>
                                            
                                            
                                        </div>
                                    </div>
                                    
                                    <div class="col-12 lg:col-4 xl:col-3">
                                        <div class="card mb-3">
                                            <h3>Details</h3>
                                            <ul class="profile-details p-0 m-0">
                                                <li class="flex align-items-center p-3">
                                                    <i class="pi pi-envelope mr-2"></i>
                                                    <div>
                                                        <div class="font-medium">Email</div>
                                                        <div class="text-color-secondary">{{user.email}}</div>
                                                    </div>
                                                </li>
                                                <li class="flex align-items-center p-3">
                                                    <i class="pi pi-phone mr-2"></i>
                                                    <div>
                                                        <div class="font-medium">Phone</div>
                                                        <div class="text-color-secondary">(123) 456-7890</div>
                                                    </div>
                                                </li>
                                                <li class="flex align-items-center p-3">
                                                    <i class="pi pi-globe mr-2"></i>
                                                    <div>
                                                        <div class="font-medium">Website</div>
                                                        <a href="https://www.example.com" target="_blank" class="text-primary hover:underline">example.com</a>
                                                    </div>
                                                </li>
                                                <li class="flex align-items-center p-3">
                                                    <i class="pi pi-linkedin mr-2"></i>
                                                    <div>
                                                        <div class="font-medium">LinkedIn</div>
                                                        <a href="https://linkedin.com/in/alicejohnson" target="_blank" class="text-primary hover:underline">linkedin.com/in/alicejohnson</a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                    
                                    </div>
                                </div>
                            </p-tabPanel>
 
                        </p-tabView>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Dialog -->
        <p-dialog header="Edit Profile" [(visible)]="displayEditDialog" [modal]="true" [style]="{width: '50vw', maxWidth: '600px'}" [draggable]="false" [resizable]="false" styleClass="profile-dialog">
            <div class="grid p-fluid">
                <div class="col-12">
                    <div class="avatar-editor mb-4 flex flex-column align-items-center">
                        <p-avatar image="assets/layout/images/profile-avatar.png" styleClass="edit-avatar mb-3" size="xlarge" shape="circle"></p-avatar>
                        <p-button label="Change Photo" icon="pi pi-camera" styleClass="p-button-sm p-button-text"></p-button>
                    </div>
                </div>
                
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="firstname" class="font-medium">First Name</label>
                        <input pInputText id="firstname" type="text" [(ngModel)]="user.firstName" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="lastname" class="font-medium">Last Name</label>
                        <input pInputText id="lastname" type="text" [(ngModel)]="user.lastName" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="email" class="font-medium">Email</label>
                        <input pInputText id="email" type="email" [(ngModel)]="user.email" />
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="field">
                        <label for="phone" class="font-medium">Phone</label>
                        <input pInputText id="phone" type="tel" [(ngModel)]="user.phone" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="field">
                        <label for="occupation" class="font-medium">Occupation</label>
                        <input pInputText id="occupation" type="text" [(ngModel)]="user.occupation" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="field">
                        <label for="location" class="font-medium">Location</label>
                        <input pInputText id="location" type="text" [(ngModel)]="user.location" />
                    </div>
                </div>
                <div class="col-12">
                    <div class="field">
                        <label for="bio" class="font-medium">Bio</label>
                        <textarea pInputTextarea id="bio" rows="5" [(ngModel)]="user.bio"></textarea>
                    </div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-content-end gap-2">
                    <p-button label="Cancel" icon="pi pi-times" (click)="hideEditDialog()" styleClass="p-button-text"></p-button>
                    <p-button label="Save Changes" icon="pi pi-check" (click)="saveProfile()" styleClass="p-button-raised"></p-button>
                </div>
            </ng-template>
        </p-dialog>

        <style>
            .profile-card {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            }

            .profile-cover-wrapper {
                position: relative;
                height: 240px;
            }

            .profile-cover {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--p-primary-600), var(--p-primary-800));
                background-image: url('https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1080&q=80');
                background-size: cover;
                background-position: center;
            }

            .profile-menu {
                position: absolute;
                top: 16px;
                right: 16px;
            }

            .profile-header {
                margin-top: -80px;
                position: relative;
                z-index: 1;
            }

            .profile-image-container {
                position: relative;
            }

            .profile-image :deep(.p-avatar) {
                width: 140px !important;
                height: 140px !important;
                border: 4px solid var(--surface-card);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .online-indicator {
                width: 16px;
                height: 16px;
                background-color: var(--green-500);
                border: 3px solid var(--surface-card);
                border-radius: 50%;
                position: absolute;
                bottom: 12px;
                right: 12px;
            }

            .profile-tabs :deep(.p-tabview-nav) {
                display: flex;
                justify-content: center;
                border-bottom-width: 1px;
            }

            .profile-details li:not(:last-child) {
                border-bottom: 1px solid var(--surface-border);
            }

            .timeline {
                position: relative;
                padding-left: 30px;
            }

            .timeline:before {
                content: '';
                position: absolute;
                left: 0;
                height: 100%;
                width: 2px;
                background: var(--surface-border);
            }

            .timeline-item {
                position: relative;
                padding-bottom: 30px;
            }

            .timeline-marker {
                position: absolute;
                left: -30px;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: var(--p-primary-color);
                border: 3px solid var(--surface-card);
                top: 6px;
            }

            .portfolio-card {
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .portfolio-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            }

            .portfolio-image {
                height: 180px;
                background-image: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHdlYnNpdGV8ZW58MHx8MHx8&w=600&q=80');
                background-size: cover;
                background-position: center;
            }

            .portfolio-2 {
                background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80');
            }

            .portfolio-3 {
                background-image: url('https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80');
            }

            .edit-avatar :deep(.p-avatar) {
                width: 120px !important;
                height: 120px !important;
                border: 3px solid var(--surface-border);
            }

            @media screen and (max-width: 576px) {
                .profile-cover-wrapper {
                    height: 180px;
                }

                .profile-header {
                    margin-top: -60px;
                }

                .profile-image :deep(.p-avatar) {
                    width: 100px !important;
                    height: 100px !important;
                }
            }
        </style>
    `
})
export class Profile {
    displayEditDialog: boolean = false;
    
    user = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '(123) 456-7890',
        occupation: 'Software Engineer',
        location: 'San Francisco, CA',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    };

    constructor(private messageService: MessageService) {}

    showEditDialog() {
        this.displayEditDialog = true;
    }

    hideEditDialog() {
        this.displayEditDialog = false;
    }

    saveProfile() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully',
            life: 3000
        });
        this.hideEditDialog();
    }
}
