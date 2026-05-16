const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  findPenggunaByEmail,
  createNewPengguna,
} = require("../model/pengguna");


// REGISTER
const register = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // cek email
    findPenggunaByEmail(email, async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      // email sudah ada
      if (result.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      // create user
      createNewPengguna(
        {
          nama: name,
          email,
          password: hashedPassword,
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          res.status(201).json({
            message: "Register success",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    findPenggunaByEmail(email, async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      // user tidak ada
      if (result.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const user = result[0];

      // compare password
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Wrong password",
        });
      }

      // generate token
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Login success",
        token,
        user: {
          id: user.id,
          name: user.nama,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};