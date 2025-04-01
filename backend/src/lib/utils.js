import jwt from "jsonwebtoken";

export const generateToke = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true, // HTTPonly cookie
    samSite: "strick",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
