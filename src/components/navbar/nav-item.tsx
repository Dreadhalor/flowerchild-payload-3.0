import { trpc } from '@flowerchild/trpc/client';
import {
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@flowerchild/components/ui/navigation-menu';
import { NavItemDropdown } from './nav-item-dropdown';
import { Button, buttonVariants } from '../ui/button';
import { Product } from '@flowerchild/payload-types';
import Link from 'next/link';

type Props = {
  categoryLabel: string;
};

export const NavItem = ({ categoryLabel }: Props) => {
  const query = {
    categoryLabel,
    sort: 'desc' as 'asc' | 'desc' | undefined,
    limit: 6,
  };

  const { data } = trpc.products.getInfiniteProducts.useQuery(
    { limit: query.limit, query },
    { getNextPageParam: (lastPage) => lastPage.nextPage },
  );

  return (
    <>
      <NavigationMenuTrigger asChild>
        <Link
          href={`/products?category=${categoryLabel.toLowerCase()}`}
          className={buttonVariants({ variant: 'navbar' })}
        >
          {categoryLabel}
        </Link>
      </NavigationMenuTrigger>
      <NavigationMenuContent className='animate-in fade-in-10 slide-in-from-top-5'>
        <NavItemDropdown
          category={categoryLabel}
          products={data?.items as any as Product[]}
        />
      </NavigationMenuContent>
    </>
  );
};
