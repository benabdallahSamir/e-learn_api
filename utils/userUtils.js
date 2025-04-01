import User from "../models/User";

export async function createUser({
  username,
  email,
  password,
  bio,
  picturePath,
  avatarPath,
}) {
  // * check params
  if (!username || !email || !password)
    throw new Error(" username, email and password are required");
  // * check username length
  if (username.length < 3 || username.length > 20)
    throw new Error(" username must be between 3 and 20 characters");
  // * check email formt
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailFormat.test(email)) return new Error(" email is not valid");
  // * check password strength
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordFormat.test(password))
    throw new Error(
      " password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    );
  // check database duplicates
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { emailId: email }],
    });
    if (existingUser) {
      throw new Error("Username or email already exists");
    }
    // * create user
    const user = await new User({
      username,
      emailId: email,
      password,
      bio,
      picturePath,
      avatarPath,
    }).save();
    return formatUser(user);
  } catch (error) {
    console.log(error);
    throw new Error("Error checking for duplicates in the database");
  }
}

export async function getUserById(id) {
  // * check params
  if (!id) throw new Error(" id is required");
  // * get user by id
  try {
    const user = await User.findById(id);
    return formatUser(user);
  } catch (error) {
    console.log(error);
    throw new Error("Error getting user by id");
  }
}

export async function getUserByQuery(object) {
  try {
    const user = await User.find(object);
    if (user.length === 0) throw new Error("User not found");
    const userFormat = user
      .map((user) => formatUser(user))
      .filter((ele) => ele !== null);
    return userFormat;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting user by objects");
  }
}

export async function updateUser(id, data) {
  const user = await user.findById(id);
  if (!user) throw new Error("User not found");
}

function formatUser(user) {
  if (!user) return null; // Handle case where user is not found
  // * additional fields
  user.id = user._id;
  user.emailVerified = Boolean(user.emailId);
  // * delete unnecessary fields
  delete user.password;
  delete user.__v;
  delete user.createdAt;
  delete user.updatedAt;
  delete user._id;
  delete user.emailId;
  // * return user object
  return user.toObject();
}
