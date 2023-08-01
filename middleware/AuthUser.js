// MIDDLEWARE DIGUNAKAN UNTUK MEMPROTEKSI END POINT NYA

import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon  Login ke  Akun anda" });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: " USER tidak ditemukan!" });
  req.userId = user.id;
  req.role = user.role;
  next();
};

// INI UNTUK ADMIN UNTUK AKSES HALAMAN
export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: " USER tidak ditemukan!" });
  if (user.role !== "admin")
    return res.status(403).json({ msg: " Akses Terlarang!" });
  next();
};
