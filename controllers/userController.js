import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { userName, password, email } = req.body;

  try {
    if (!userName || !password || !email) {
      return res.status(200).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already present, Please Sign-in" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      password: hashedPassword,
      email,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Unable to create new User", data: error.message });
    }

    return res
      .status(200)
      .json({ message: "User Created Successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the requried parameters" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not Found. Please create new account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentails" });
    }

    const accessToken = jwt.sign(
      { id: user?.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }
    );

    const refreshToken = jwt.sign(
      { id: user?.id, role: user?.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 10,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res
      .status(200)
      .json({ message: "SignIn Success. Welcome to our Website", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};
