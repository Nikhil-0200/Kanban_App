import express from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { userName, password, role } = req.body;

  try {
    const checkUser = await userModel.findOne({ userName });

    if (checkUser) {
      return res.status(500).json({ msg: `User already exist` });
    }

    const hashPassword = await bcrypt.hash(password, 2);

    const registerUser = new userModel({
      userName,
      password: hashPassword,
      role,
    });

    await registerUser.save();

    res.status(200).json({ msg: `User registered successfully` });
  } catch (error) {
    res.status(404).json({ msg: `Error occured during registering user ${error}` });
  }
});

userRouter.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await userModel.findOne({ userName });

    if (!user) {
      return res.status(404).json({ msg: `Incorrect userName or Password` });
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(404).json({ msg: `Incorrect userName or Password` });
      }

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

      res.status(201).json({ msg: `User login successfully`, token });
    }
  } catch (error) {}
});

export default userRouter;
