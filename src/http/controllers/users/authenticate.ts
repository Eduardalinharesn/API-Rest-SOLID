import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUserCase } from '@/use-cases/authenticate';
import { InvalidCredentialsErros } from '@/use-cases/errors/invalid-credentials';
import { makeAuthenticadeUseCase } from '@/use-cases/factories/make-athenticate-use-case';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUserCase = makeAuthenticadeUseCase();

    const { user } = await authenticateUserCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      }
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsErros) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
