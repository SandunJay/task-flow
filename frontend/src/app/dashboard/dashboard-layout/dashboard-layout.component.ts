import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostBinding } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../shared/theme/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styles: []
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  // Sidebar state
  isSidebarOpen = false;
  isCollapsed = false;
  isMobileView = false;
  private isBrowser: boolean;
  private resizeObserver?: ResizeObserver;
  private themeSubscription?: Subscription;
  
  // Host binding to apply dark theme class
  @HostBinding('class.dark') isDarkTheme = false;
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  ngOnInit() {
    if (this.isBrowser) {
      this.checkScreenSize();
      
      // Default sidebar state based on screen size
      // On mobile, sidebar should be hidden by default
      this.isSidebarOpen = !this.isMobileView;
      // Only collapse sidebar on medium screens (not mobile)
      this.isCollapsed = window.innerWidth < 1280 && window.innerWidth >= 768;
      
      // Subscribe to theme changes
      this.themeSubscription = this.themeService.theme$.subscribe(theme => {
        this.isDarkTheme = theme === 'dark';
        
        // Apply dark mode class to document for global styling
        if (this.isDarkTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
      
      // Use ResizeObserver for better performance than window resize events
      this.setupResizeObserver();
    }
  }
  
  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private setupResizeObserver() {
    if (this.isBrowser && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.checkScreenSize();
        
        // If transitioning from mobile to desktop, ensure sidebar state is correct
        if (!this.isMobileView) {
          this.isSidebarOpen = true;  // Always open on desktop
          this.isCollapsed = window.innerWidth < 1280; // Collapsed on medium desktop
        }
      });
      
      this.resizeObserver.observe(document.body);
    } else {
      // Fallback for browsers without ResizeObserver
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }
  
  onResize() {
    if (this.isBrowser) {
      this.checkScreenSize();
      
      // If transitioning from mobile to desktop, ensure sidebar state is correct
      if (!this.isMobileView) {
        this.isSidebarOpen = true;  // Always open on desktop
        this.isCollapsed = window.innerWidth < 1280; // Collapsed on medium desktop
      }
    }
  }
  
  checkScreenSize() {
    if (this.isBrowser) {
      const wasMobileView = this.isMobileView;
      this.isMobileView = window.innerWidth < 768;
      
      // If transitioning between mobile and desktop views, adjust sidebar state
      if (wasMobileView !== this.isMobileView) {
        if (this.isMobileView) {
          // When entering mobile view, always close the sidebar
          this.isSidebarOpen = false;
        } else {
          // When entering desktop view, always open the sidebar
          this.isSidebarOpen = true;
          // Only collapse on medium screens (tablet)
          this.isCollapsed = window.innerWidth < 1280 && window.innerWidth >= 768;
        }
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    
    // On mobile, toggling only shows/hides sidebar, doesn't collapse
    // On desktop, make sure we respect the collapsed state
    if (!this.isMobileView) {
      // Keep the existing collapsed state on desktop
    } else {
      // Always ensure sidebar is fully expanded when opened on mobile
      this.isCollapsed = false;
    }
  }
  
  handleSidebarToggle(isCollapsed: boolean) {
    // Only allow collapsing on desktop/tablet, not mobile
    if (!this.isMobileView) {
      this.isCollapsed = isCollapsed;
      this.isSidebarOpen = true;
    }
  }
  
  toggleCollapsedSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  
  closeSidebarOnOverlayClick() {
    if (this.isMobileView) {
      this.isSidebarOpen = false;
    }
  }

  onToggleSidebar() {
    this.toggleSidebar();
  }
}