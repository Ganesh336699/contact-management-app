import bcrypt, { compareSync } from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";


export const SignUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  //missing fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: `Please enter all the required field.` });
  }

  // name validation.
  if (name.length > 20)
    return res
      .status(400)
      .json({ message: "name can only be less than 25 characters" });

  // email validation.
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ message: "please enter a valid email address." });

  // validation of password.
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "password must be atleast 8 characters long" });

  try {
    const ExistingUser = await User.findOne({ email });

    if (ExistingUser)
      return res.status(400).json({
        error: `a user with this email [${email}] already exists , please try another one.`,
      });

    let user;
    const hashedPassword = await bcrypt.hashSync(password ,12);
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();

    user._doc.password = undefined;

    return res.status(201).json({ ...user._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
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
      return res.status(400).json({ error: "Invalid email or password!" });

    
    const isPasswordCorrect  = await compareSync(password, ExistingUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid email or password!" });

    const payload = { _id: ExistingUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = { ...ExistingUser._doc, password: undefined };
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
