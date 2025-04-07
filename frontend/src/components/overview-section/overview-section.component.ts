import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { ThemeService } from '../../app/shared/theme/theme.service';

interface ProjectStats {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  percentage?: number;
  color: string;
}

interface TeamActivity {
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  action: string;
  target: string;
  time: string;
}

interface TaskChart {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-section.component.html',
  // styleUrls: ['./overview-section.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerFadeInUp', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('widthAnimation', [
      transition(':enter', [
        style({ width: '0%' }),
        animate('800ms ease-out', style({ width: '*' }))
      ])
    ]),
    trigger('heightAnimation', [
      transition(':enter', [
        style({ height: '0%' }),
        animate('1000ms ease-out', style({ height: '*' }))
      ])
    ])
  ]
})
export class OverviewSectionComponent implements OnInit {
  projectStats: ProjectStats[] = [
    {
      title: 'Total Tasks',
      value: 38,
      trend: 'up',
      icon: '📋',
      percentage: 24,
      color: 'bg-blue-500'
    },
    {
      title: 'In Progress',
      value: 12,
      trend: 'up',
      icon: '⚙️',
      percentage: 15,
      color: 'bg-indigo-500'
    },
    {
      title: 'Completed',
      value: 22,
      trend: 'up',
      icon: '✅',
      percentage: 30,
      color: 'bg-green-500'
    },
    {
      title: 'Team Members',
      value: 7,
      subtext: 'Active',
      icon: '👥',
      color: 'bg-purple-500'
    }
  ];

  taskChartData: TaskChart[] = [
    { label: 'Completed', value: 58, color: 'bg-green-500' },
    { label: 'In Progress', value: 32, color: 'bg-blue-500' },
    { label: 'Not Started', value: 10, color: 'bg-gray-300' }
  ];

  recentActivities: TeamActivity[] = [
    {
      user: {
        name: 'Karen Smith',
        avatar: '/assets/avatar1.png',
        role: 'UX Designer'
      },
      action: 'completed',
      target: 'Wireframing',
      time: '2 hours ago'
    },
    {
      user: {
        name: 'Steve McConell',
        avatar: '/assets/avatar2.png',
        role: 'Developer'
      },
      action: 'commented on',
      target: 'Customer Journey Mapping',
      time: '4 hours ago'
    },
    {
      user: {
        name: 'Sarah Green',
        avatar: '/assets/avatar3.png',
        role: 'Project Manager'
      },
      action: 'created',
      target: 'User Research',
      time: 'yesterday'
    },
    {
      user: {
        name: 'Brad Smith',
        avatar: '/assets/avatar4.png',
        role: 'QA Engineer'
      },
      action: 'updated',
      target: 'Prototype Development',
      time: 'yesterday'
    }
  ];

  upcomingDeadlines = [
    {
      title: 'User Testing Analysis',
      date: '2023-07-25',
      remainingDays: 6,
      statusColor: 'bg-yellow-500'
    },
    {
      title: 'Content Strategy',
      date: '2023-08-02',
      remainingDays: 14,
      statusColor: 'bg-green-500'
    },
    {
      title: 'Visual Design',
      date: '2023-07-22',
      remainingDays: 3,
      statusColor: 'bg-red-500'
    }
  ];

  weeklyProductivity = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 52 },
    { day: 'Thu', value: 75 },
    { day: 'Fri', value: 60 },
    { day: 'Sat', value: 25 },
    { day: 'Sun', value: 10 }
  ];

  isChartVisible = false;
  currentTheme = 'light';
  isBrowser = false;
  
  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  // ngOnInit() {
  //   // Subscribe to theme changes
  //   if (this.isBrowser) {
  //     this.themeService.theme$.subscribe(theme => {
  //       this.currentTheme = theme;
  //     });
      
  //     // Initialize with a slight delay to trigger animations
  //     setTimeout(() => {
  //       this.isChartVisible = true;
  //     }, 500);
  //   }
  // }

  ngOnInit() {
    // Subscribe to theme changes
    if (this.isBrowser) {
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
        // Optionally add a data attribute to the document for additional theme handling
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
      
      // Initialize with a slight delay to trigger animations
      setTimeout(() => {
        this.isChartVisible = true;
      }, 500);
    }
  }
  
  getTrendIcon(trend?: 'up' | 'down' | 'neutral') {
    switch(trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  }

  // getTrendClass(trend?: 'up' | 'down' | 'neutral') {
  //   switch(trend) {
  //     case 'up': return 'text-green-600';
  //     case 'down': return 'text-red-600';
  //     default: return 'text-gray-600';
  //   }
  // }
  getTrendClass(trend?: 'up' | 'down' | 'neutral') {
    switch(trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }

  getDaysLabel(days: number): string {
    return days === 1 ? 'day' : 'days';
  }

  // getDeadlineClass(days: number): string {
  //   if (days <= 3) return 'text-red-600';
  //   if (days <= 7) return 'text-yellow-600';
  //   return 'text-green-600';
  // }

  getDeadlineClass(days: number): string {
    if (days <= 3) return 'text-red-600 dark:text-red-400';
    if (days <= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  }

  // Add a helper method to calculate the left position for each chart segment
  getLeftPosition(index: number): number {
    return this.taskChartData
      .slice(0, index)
      .reduce((sum, curr) => sum + curr.value, 0);
  }
}
