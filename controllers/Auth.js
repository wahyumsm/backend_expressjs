import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import session from "express-session";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user)
    return res
      .status(404)
      .json({ msg: "Email tidak ditemukan Silahkan Daftar dulu!" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "kata sandi salah" });

  // Generate the access token
  const accessToken = jwt.sign(
    {
      userId: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    "secret_key", // Ganti dengan kunci rahasia yang sama dengan yang digunakan pada middleware express-session
    { expiresIn: "1h" } // Token akan kadaluwarsa dalam 1 jam (sesuaikan dengan kebutuhan Anda)
  );

  // Menggunakan req.session untuk menyimpan data pengguna dalam session
  req.session.userId = user.uuid;
  req.session.accessToken = accessToken;
  res.status(200).json({
    accessToken,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const Me = async (req, res) => {
  // Periksa apakah ada token akses di dalam session
  if (!req.session.accessToken) {
    return res.status(401).json({ msg: "Mohon Login ke Akun anda" });
  }

  try {
    // Verifikasi token akses menggunakan JWT dan mendapatkan data pengguna dari token
    const decodedToken = jwt.verify(req.session.accessToken, "secret_key");
    const user = await User.findOne({
      attributes: ["uuid", "email", "role"],
      where: {
        uuid: decodedToken.userId,
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ msg: "Email Dan Name tidak ditemukan Silahkan Daftar dulu!" });
    res.status(200).json(user);
  } catch (error) {
    // Jika token tidak valid atau kadaluwarsa, bersihkan session dan beri tahu pengguna untuk login kembali
    req.session.destroy();
    res.status(401).json({ msg: "Mohon Login kembali" });
  }
};

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "TIDAK DAPAT LOGOUT" });
    res.status(200).json({ msg: "Anda Telah Logout" });
  });
};
