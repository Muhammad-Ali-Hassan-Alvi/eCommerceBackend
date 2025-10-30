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

    const { password: _, ...userWithoutPassword} = user.toObject()
    return res
      .status(200)
      .json({ message: "User Created Successfully", data: userWithoutPassword });
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

    const { password: _, ...userWithoutPassword} = user.toObject();
    return res
      .status(200)
      .json({ message: "SignIn Success. Welcome to our Website", data: userWithoutPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Unable to find User Profile.... " });
    }

    return res
      .status(200)
      .json({ message: "User Founded Successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userName, email, password, shippingAddress } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found..." });
    }

    if (userName) user.userName = userName;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (shippingAddress) user.shippingAddress = shippingAddress;

    const updatedUser = await user.save();
    const { password: _, ...userWithoutPassword } = updatedUser.toObject();

    return res.status(200).json({
      message: "User profile updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      data: error.message,
    });
  }
};

export const handleLogoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(404).json({ message: "User not Found...." });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(404).json({ message: "User not Found..." });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(200).json({ message: "User Logged Out successfully..." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Token missing..." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found..." });
    }

    return res
      .status(200)
      .json({ message: "User Authenticated....", data: user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "User not Authenticated..." });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshToken;
    const accessToken = req?.cookies?.accessToken;

    if (!refreshToken || !accessToken) {
      return res
        .status(401)
        .json({ message: "Session Expired. Please Login again...." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not Found. Please Register first..." });
    }

    if (user?.refreshToken !== refreshToken) {
      return res.status(400).json({
        message: "Refresh token mismatch. Possible token reuse detected.",
      });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    return res
      .status(200)
      .json({ message: "Access Token refreshed", data: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not Found. Please register or Login...." });
    }

    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json({ message: "User deleted Successfully..." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error...", data: error.message });
  }
};
