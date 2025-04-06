import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProjectBoardComponent } from '../../components/project-board/project-board.component';
import { TeamMemberComponent } from '../../components/team-member/team-member.component';
import { RouterModule } from '@angular/router';

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    ProjectBoardComponent,
    TeamMemberComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  collapsed = false;
  
  // Sample team members data
  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Karen Smith',
      avatar: '/assets/placeholder.svg',
      status: 'online'
    },
    {
      id: 2,
      name: 'Steve Mcconell',
      avatar: '/assets/placeholder.svg',
      status: 'online'
    },
    {
      id: 3,
      name: 'Sarah Green',
      avatar: '/assets/placeholder.svg',
      status: 'offline',
      lastSeen: '2 hours ago'
    },
    {
      id: 4,
      name: 'Brad Smith',
      avatar: '/assets/placeholder.svg',
      status: 'offline',
      lastSeen: '5 hours ago'
    },
    {
      id: 5,
      name: 'Alice Cornell',
      avatar: '/assets/placeholder.svg',
      status: 'online'
    }
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
