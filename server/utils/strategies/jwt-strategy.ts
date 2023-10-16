import { Strategy, ExtractJwt } from "passport-jwt";
import prisma from "../../db/connection";
const JWTStrategy = new Strategy(
  {
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: any, done: any) => {
    try {
      const token = await prisma.token.findUnique({
        where: {
          id: payload.tokenId,
        },
        include: {
          users: true,
        },
      });
      if (token) {
        return done(null, { ...token.users, tokenId: token.id });
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);

export default JWTStrategy;
