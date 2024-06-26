import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { QueryValidator } from '@flowerchild/lib/validators/query-validator';
import getPayloadClient from '@/src/lib/payload-client';

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
      const { query, cursor } = input;
      const { sort, limit, categoryLabel, ...queryOpts } = query;
      const parsedQueryOptions: Record<string, { equals: string }> = {};
      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOptions[key] = { equals: value };
      });

      const page = cursor || 1;
      const payload = await getPayloadClient();

      const where: any = {
        approvedForSale: { equals: 'approved' },
        ...parsedQueryOptions,
      };

      if (categoryLabel) {
        where['category.label'] = { equals: categoryLabel };
      }

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'products',
        where,
        sort,
        depth: 1,
        limit,
        page,
      });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});
