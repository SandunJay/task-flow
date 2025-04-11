export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  comments: number;
  assignee: {
    name: string;
    avatar: string;
  };
  tags?: { name: string; color: string }[];
  progress?: string;
  assignees?: number[];
  attachments?: number;
  views?: number;
}

export interface TaskColumn {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
  count: number;
}

export const MOCK_TASK_COLUMNS: TaskColumn[] = [
  {
    id: 'col1',
    name: 'To Do',
    count: 3,
    color: '#A78BFA',
    tasks: [
      {
        id: 1,
        title: 'Research API integration options',
        description: 'Look into available third-party APIs for payment processing and compare pricing and features.',
        dueDate: '2023-08-15',
        priority: 'Medium',
        status: 'To Do',
        comments: 2,
        assignee: {
          name: 'John Smith',
          avatar: 'assets/avatar1.png'
        }
      },
      {
        id: 2,
        title: 'Create wireframes for dashboard',
        description: 'Design initial wireframes for the analytics dashboard including chart placements and key metrics.',
        dueDate: '2023-08-18',
        priority: 'High',
        status: 'To Do',
        comments: 0,
        assignee: {
          name: 'Emma Johnson',
          avatar: 'assets/avatar2.png'
        }
      },
      {
        id: 3,
        title: 'Review competitor features',
        description: 'Analyze competitor products and identify key features we should implement in our next version.',
        dueDate: '2023-08-20',
        priority: 'Low',
        status: 'To Do',
        comments: 1,
        assignee: {
          name: 'Michael Lee',
          avatar: 'assets/avatar3.png'
        }
      }
    ]
  },
  {
    id: 'col2',
    name: 'In Progress',
    count: 2,
    color: '#38BDF8',
    tasks: [
      {
        id: 4,
        title: 'Implement user authentication',
        description: 'Set up OAuth2 authentication flow and JWT token validation for secure user login.',
        dueDate: '2023-08-10',
        priority: 'High',
        status: 'In Progress',
        comments: 3,
        assignee: {
          name: 'Sarah Chen',
          avatar: 'assets/avatar4.png'
        }
      },
      {
        id: 5,
        title: 'Design database schema',
        description: 'Create relational database schema with proper indexes and foreign keys for optimal performance.',
        dueDate: '2023-08-12',
        priority: 'Medium',
        status: 'In Progress',
        comments: 2,
        assignee: {
          name: 'David Wilson',
          avatar: 'assets/avatar1.png'
        }
      }
    ]
  },
  {
    id: 'col3',
    name: 'Review',
    count: 1,
    color: '#FB923C',
    tasks: [
      {
        id: 6,
        title: 'Create REST API documentation',
        description: 'Document all API endpoints, request parameters, and response formats using Swagger.',
        dueDate: '2023-08-05',
        priority: 'Medium',
        status: 'Review',
        comments: 4,
        assignee: {
          name: 'Lisa Johnson',
          avatar: 'assets/avatar2.png'
        }
      }
    ]
  },
  {
    id: 'col4',
    name: 'Completed',
    count: 2,
    color: '#10B981',
    tasks: [
      {
        id: 7,
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment workflow using GitHub Actions.',
        dueDate: '2023-08-01',
        priority: 'High',
        status: 'Completed',
        comments: 0,
        assignee: {
          name: 'Alex Turner',
          avatar: 'assets/avatar3.png'
        }
      },
      {
        id: 8,
        title: 'Initial project setup',
        description: 'Set up project structure, dependencies, and development environment configuration.',
        dueDate: '2023-07-28',
        priority: 'Medium',
        status: 'Completed',
        comments: 1,
        assignee: {
          name: 'Ryan Martinez',
          avatar: 'assets/avatar4.png'
        }
      }
    ]
  }
];
