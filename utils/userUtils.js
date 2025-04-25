import User from "../models/User";
import bcrypt from "bcryptjs";
export async function createUser({
  username,
  email,
  password,
  bio,
  picturePath,
  avatarPath,
}) {
  // check database duplicates
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { emailId: email }],
    });
    if (existingUser) {
      throw new Error("Username or email already exists");
    }
    // * hashing password
    const hashingPassword = await bcrypt.hash(password, 10);
    // * create user
    const user = await new User({
      username,
      email: email,
      password: hashingPassword,
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
  const { username, emailId, password, bio, picturePath, avatarPath } = data;
  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (emailId) updateData.emailId = emailId;
    if (password) updateData.password = password;
    if (bio) updateData.bio = bio;
    if (picturePath) updateData.picturePath = picturePath;
    if (avatarPath) updateData.avatarPath = avatarPath;
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    updateUser.id = updatedUser._id;
    updateUser.emailVerified = Boolean(updatedUser.emailId);
    return formatUser(updateUser);
  } catch (error) {
    console.log(error);
    throw new Error("Error updating user");
  }
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
