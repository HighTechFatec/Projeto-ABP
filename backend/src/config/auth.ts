
export const jwtConfig = {
  secret: process.env.JWT_SECRET || "JWT123456",
  expiresIn: "1h",
};
