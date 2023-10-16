import jwt from "jsonwebtoken";
const token: string = process.env.ACCESS_TOKEN_SECRET || "Mawlana";
export default function createAccessToken(userId: number, tokenId: number) {
  return jwt.sign({ userId, tokenId }, token, {
    expiresIn: "1d",
  });
}
