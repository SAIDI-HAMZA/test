import { FastifyReply, FastifyRequest } from 'fastify';

export const isAlive = (req: FastifyRequest, res: FastifyReply) => {
  res.code(200);
  res.send({
    message: 'alive',
  });
};
