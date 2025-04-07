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
  isCompactView = false;
  
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
      // Check mobile view
      const wasMobile = this.isMobileView;
      this.isMobileView = window.innerWidth < 768;
      
      // Auto switch to compact view on medium screens, but not on mobile
      this.isCompactView = window.innerWidth < 992 && !this.isMobileView;
      
      // If transitioning from mobile to desktop, ensure sidebar state is correct
      if (wasMobile && !this.isMobileView) {
        this.isSidebarOpen = true;  // Always open on desktop
        this.isCollapsed = window.innerWidth < 1280; // Collapsed on medium desktop
      }
      
      // If transitioning from desktop to mobile, ensure sidebar is closed
      if (!wasMobile && this.isMobileView) {
        this.isSidebarOpen = false; // Close sidebar on mobile by default
      }
      
      // Update layout when task details panel is open
      if (this.isSidebarOpen && !this.isMobileView) {
        // ...existing code...
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
    
    // On mobile, when opening sidebar, always ensure sidebar is expanded
    if (this.isMobileView && this.isSidebarOpen) {
      this.isCollapsed = false;
    }
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

  onToggleSidebar(): void {
    this.toggleSidebar();
  }
}
