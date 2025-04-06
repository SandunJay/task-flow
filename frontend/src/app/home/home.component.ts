import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TeamMemberComponent } from '../../components/team-member/team-member.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    TeamMemberComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  teamMembers: any[] = [];
  collapsed = false;
  isAuthenticated = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(): void {
    // Check if the user is authenticated
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
      
      // Initialize team members data (could come from a service in a real app)
      if (this.isAuthenticated) {
        this.initializeTeamMembers();
      }
    }
  }
  
  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
  
  initializeTeamMembers(): void {
    // Sample data for team members
    this.teamMembers = [
      {
        id: 1,
        name: 'John Smith',
        role: 'Project Manager',
        avatar: 'assets/avatar1.png',
        status: 'online'
      },
      // ...more team members
    ];
  }
}
