import React from 'react';
import { MaxWidthWrapper } from '../max-width-wrapper';
import Link from 'next/link';
import Logo from '@flowerchild/assets/logo-hollow.svg';
import { cn } from '@flowerchild/lib/utils';
import { NavItems } from './nav-items';
import { buttonVariants } from '../ui/button';
import { Cart } from './cart';
import { Separator } from '../ui/separator';
import { getServerSideUser } from '@flowerchild/lib/payload-utils';
import { cookies } from 'next/headers';
import { UserAccountNav } from './user-account-nav';
import { NavigationMenu, NavigationMenuList } from '../ui/navigation-menu';
// import { SignIn } from './sign-in-button';

export const Navbar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <NavigationMenu
      className='sticky inset-x-0 top-0 z-50 h-16 max-h-16 max-w-none border-b border-gray-200 bg-primary shadow-md'
      viewportClassnames='mt-0 border-0 bg-primary rounded-none'
    >
      <header className='relative h-full w-full'>
        <MaxWidthWrapper>
          <div className='flex h-16 items-center'>
            <div className='ml-4 flex lg:ml-0'>
              <Link href='/'>
                <Logo className='h-10 w-10' />
              </Link>
            </div>
            <div
              className={cn(
                'flex h-full flex-nowrap',
                'z-50',
                'lg:ml-8 lg:self-stretch',
              )}
            >
              <NavigationMenuList className='h-full'>
                <NavItems />
              </NavigationMenuList>
            </div>
            <div className='ml-auto flex h-full items-center'>
              <div
                className={cn(
                  'hidden h-full',
                  'lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6',
                )}
              >
                {!user && (
                  <>
                    <Link
                      href='/login'
                      className={cn(buttonVariants({ variant: 'navbar' }))}
                    >
                      Log in / Register
                    </Link>
                    <Separator className='h-6' orientation='vertical' />
                  </>
                )}

                {/* <SignIn /> */}

                {user && (
                  <>
                    <UserAccountNav user={user} />
                    <Separator className='h-6' orientation='vertical' />
                  </>
                )}

                <div className='ml-4 flow-root h-full lg:ml-6'>
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </NavigationMenu>
  );
};
