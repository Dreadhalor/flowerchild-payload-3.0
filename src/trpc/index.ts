import { productsRouter } from './routers/products-router';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return [
      { id: 1, text: 'Buy milk' },
      { id: 2, text: 'Buy eggs' },
    ];
  }),
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
