export const AddContact = async (req, res, next) => {
  const { name, address, email, phone } = req.body;
  // Missing fields
  if (!name || !email || !address || !phone) {
    return res.status(400).json({
      message: "Please provide all required fields (name, email, password).",
    });
  }

  // Name validation
  if (name.length > 20) {
    return res.status(400).json({
      message: "Name can be up to 20 characters long.",
    });
  }

  // Email validation
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailReg.test(email)) {
    return res.status(400).json({ message: "Invalid email address format." });
  }

  //Phone validation
  const mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ message: "Invalid mobile number." });
  }

  //address validation
  const addressRegex = /^[a-zA-Z0-9\s.,#\-]{10,100}$/;
  if (addressRegex.test(address)) {
    return res.status(400).json({ message: "Invalid Address." });
  }

  try {
  } catch (err) {
    console.log(err);
  }
};

export const getContacts = async (req, res, next) => {};

export const updateContact = async (req, res, next) => {};

export const deleteContact = async (req, res, next) => {};
