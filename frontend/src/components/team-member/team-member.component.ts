// components/team-member/team-member.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent {
  @Input() member: any;
  
  getStatusColor(): string {
    switch(this.member?.status.toLowerCase()) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-amber-500';
      case 'busy':
        return 'bg-rose-500';
      default:
        return 'bg-gray-500';
    }
  }
}