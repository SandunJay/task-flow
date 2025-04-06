import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  // Sidebar state
  isSidebarOpen = false;
  isCollapsed = false;
  isMobileView = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      // Default sidebar state based on screen size
      this.isSidebarOpen = !this.isMobileView;
      this.isCollapsed = window.innerWidth < 1280 && window.innerWidth >= 768;
    }
  }
  
  ngOnDestroy() {
    // Cleanup if needed
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      
      // Auto-close sidebar on mobile when resizing down
      if (this.isMobileView && this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
      
      // Auto-open sidebar on desktop when resizing up
      if (!this.isMobileView && !this.isSidebarOpen) {
        this.isSidebarOpen = true;
        this.isCollapsed = window.innerWidth < 1280;
      }
    }
  }
  
  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < 768;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  toggleCollapsedSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  // Close sidebar when clicking overlay (mobile only)
  closeSidebarOnOverlayClick() {
    if (this.isMobileView) {
      this.isSidebarOpen = false;
    }
  }
}
