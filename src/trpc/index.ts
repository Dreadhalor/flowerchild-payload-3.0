import { authRouter } from './routers/auth-router';
import { paymentRouter } from './routers/payment-router';
import { productsRouter } from './routers/products-router';
import { router } from './trpc';

export const appRouter = router({
  products: productsRouter,
  auth: authRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
