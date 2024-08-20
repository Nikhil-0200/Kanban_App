import jsonwebtoken, { decode } from "jsonwebtoken";
import userModel from "../models/user.model.js";
const jwt = jsonwebtoken;

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.send({ msg: `Token Required` });
  }

  if (token) {
    try {
      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
          return res.send({ msg: `Invalid Token` });
        }

        if (decoded) {
          const userId = decoded.id;
          const user = await userModel.findById(userId);

          if (!user) {
            return res.send({ msg: `User not found in auth` });
          }

          req.user = user;
          next();
        }
      });
    } catch (error) {
      res.status(500).json({ msg: `Invalid Token` });
    }
  }
};

export default auth;
