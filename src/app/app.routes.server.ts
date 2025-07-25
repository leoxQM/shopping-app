import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Aquí deberías retornar una lista de objetos con valores posibles de ":id"
      return [
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
