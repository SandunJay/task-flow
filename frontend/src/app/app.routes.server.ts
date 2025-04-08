import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'project-board/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => {
      return Promise.resolve([
        { id: '1' },
        { id: '2' }
      ]);
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
