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
  isSidebarOpen = false;
  isCollapsed = false;
  isMobileView = false;
  private isBrowser: boolean;
  private resizeObserver?: ResizeObserver;
  private themeSubscription?: Subscription;
  
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
      
      this.isSidebarOpen = !this.isMobileView;
      this.isCollapsed = window.innerWidth < 1280 && window.innerWidth >= 768;
      
      this.themeSubscription = this.themeService.theme$.subscribe(theme => {
        this.isDarkTheme = theme === 'dark';
        
        if (this.isDarkTheme) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
      
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
        
        if (!this.isMobileView) {
          this.isSidebarOpen = true;  
          this.isCollapsed = window.innerWidth < 1280; 
        }
      });
      
      this.resizeObserver.observe(document.body);
    } else {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }
  
  onResize() {
    if (this.isBrowser) {
      this.checkScreenSize();
      
      if (!this.isMobileView) {
        this.isSidebarOpen = true;  
        this.isCollapsed = window.innerWidth < 1280; 
      }
    }
  }
  
  checkScreenSize() {
    if (this.isBrowser) {
      const wasMobileView = this.isMobileView;
      this.isMobileView = window.innerWidth < 768;
            if (wasMobileView !== this.isMobileView) {
        if (this.isMobileView) {
          this.isSidebarOpen = false;
        } else {
          this.isSidebarOpen = true;
          this.isCollapsed = window.innerWidth < 1280 && window.innerWidth >= 768;
        }
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (!this.isMobileView) {
      this.isSidebarOpen = !this.isSidebarOpen;
    } else {
      this.isCollapsed = false;
    }
  }
  
  handleSidebarToggle(isCollapsed: boolean) {
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