import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { QueryValidator } from '@flowerchild/lib/validators/query-validator';

export const productsRouter = router({
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      }),
    )
    .query(async ({ input }) => {
      return {
        items: [],
        nextPage: null,
      };
    }),
});
