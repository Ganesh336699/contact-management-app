import bcrypt, { compareSync } from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";


export const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Missing fields
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Please provide all required fields (name, email, password).',
    });
  }

  // Name validation
  if (name.length > 20) {
    return res.status(400).json({
      message: 'Name can be up to 20 characters long.',
    });
  }

  // Email validation
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailReg.test(email)) {
    return res.status(400).json({ message: 'Invalid email address format.' });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long.',
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: `A user with email ${email} already exists. Please use a different email.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();

    user._doc.password = undefined; // Remove password from response

    return res.status(201).json({ message: 'User created successfully!', user: user._doc });
  } catch (err) {
    console.error('Signup Error:', err);
    return res.status(500).json({
      message: 'Internal Server Error. Please try again later.',
      error: err.message,
    });
  }
};

export const Login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "please enter all the required fields!" });

  // email validation.
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ message : "please enter a valid email address." });

      let ExistingUser;
  try {
         ExistingUser = await User.findOne({ email });

    if (!ExistingUser)
      return res.status(400).json({ message: "Invalid email or password!" });

    
    const isPasswordCorrect  = await compareSync(password, ExistingUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid email or password!" });

    const payload = { _id: ExistingUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = { ...ExistingUser._doc, password: undefined };
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An expected error occured . Please try again later." });
  }
};
