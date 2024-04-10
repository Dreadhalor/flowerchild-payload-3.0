import { createTRPCReact } from '@trpc/react-query';

import { type AppRouter } from '@flowerchild/trpc';

export const trpc = createTRPCReact<AppRouter>({});
