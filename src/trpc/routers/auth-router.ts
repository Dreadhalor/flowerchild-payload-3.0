import { getPayloadClient } from '@flowerchild/lib/payload-client';
import { publicProcedure, router } from '../trpc';
import { AuthCredentialsValidator } from '@flowerchild/lib/validators/account-credentials-validator';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input: { email, password } }) => {
      const payload = await getPayloadClient();

      // check if user exists
      const { docs } = await payload.find({
        collection: 'users',
        where: {
          email: {
            like: email,
          },
        },
      });

      if (docs.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        });
      }

      // create user
      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          role: 'user',
        },
      });

      return {
        success: true,
        sentToEmail: email,
      };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input: { email, password } }) => {
      const payload = await getPayloadClient();
      try {
        const { token } = await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
        });

        // set cookie
        // we have to do this manually now because I think Payload 3.0 beta has a bug
        cookies().set('payload-token', token!, {
          domain: undefined,
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: false,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      // try {
      //   await payload.login({
      //     collection: 'users',
      //     data: {
      //       email,
      //       password,
      //     },
      //   });
      // } catch (error) {
      //   throw new TRPCError({
      //     code: 'UNAUTHORIZED',
      //     message: 'Invalid credentials',
      //   });
      // }

      return {
        success: true,
      };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input: { token } }) => {
      const payload = await getPayloadClient();
      if (!payload) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Payload not found',
        });
      }

      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      });

      if (!isVerified) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Cannot verify email with this token',
        });
      }

      return {
        success: true,
      };
    }),
});
