import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 }))
  ])
]);

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const staggerIn = trigger('staggerIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(80, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

export const tabTransition = trigger('tabTransition', [
  transition('* => *', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(50px)' })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-50px)' }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { optional: true })
  ])
]);

export const pulseAnimation = trigger('pulseAnimation', [
  state('active', style({ transform: 'scale(1.05)' })),
  state('inactive', style({ transform: 'scale(1)' })),
  transition('inactive <=> active', animate('300ms ease-in-out'))
]);

export const sidebarAnimations = {
  fadeIn: trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 }))
    ])
  ]),
  rotateIcon: trigger('rotateIcon', [
    state('true', style({ transform: 'rotate(180deg)' })),
    state('false', style({ transform: 'rotate(0deg)' })),
    transition('true <=> false', animate('300ms ease-in-out'))
  ]),
  highlightAnimation: trigger('highlightAnimation', [
    state('inactive', style({
      background: 'transparent'
    })),
    state('active', style({
      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 100%)'
    })),
    transition('inactive <=> active', animate('300ms ease-in-out'))
  ]),
  pulseAnimation: trigger('pulseAnimation', [
    state('inactive', style({
      transform: 'scale(1)'
    })),
    state('active', style({
      transform: 'scale(1.1)'
    })),
    transition('inactive <=> active', animate('300ms ease-in-out'))
  ])
};

export const modalAnimations = {
  modalAnimation: trigger('modalAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
    ])
  ]),
  backdropAnimation: trigger('backdropAnimation', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0 }))
    ])
  ])
};
