import { User } from "../models/User.js";
import { Follow } from "../models/Follow.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;

  if (!username || !fullName || !email || !password) {
    throw new AppError("Please provide all the required fields", 400);
    // return next(new AppError("Please provide all the required fields", 400));
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  //TODO: Fix the cloudinary upload
  let profilePictureURL =
    "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

  if (req.file) {
    const profilePicturePath = req.file.path;
    console.log("File path:", profilePicturePath); // Log the file path for debugging
    try {
      const pictureURL = await uploadOnCloudinary(profilePicturePath);
      if (pictureURL) {
        profilePictureURL = pictureURL;
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error); // Log the error for debugging
      throw new AppError("Error uploading profile picture to Cloudinary", 500);
    }
  }

  const user = await User.create({
    fullName,
    username,
    email,
    password,
    profilePicture: profilePictureURL,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new AppError("User not found", 404);
  }

  const token = generateToken(createdUser._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, token },
        "User created successfully"
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePasswords(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
          },
          token,
        },
        "Login successful"
      )
    );
});

export const logout = asyncHandler(async (req, res, next) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
    })
    .status(200)
    .json(new ApiResponse(200, null, "Logout successful"));
});

//Checking -left

export const editProfile = asyncHandler(async (req, res, next) => {
  const { fullName, username, email , bio} = req.body;

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (fullName) {
    user.fullName = fullName;
  }

  if (username) {
    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return next(new AppError("Username already exists", 400));
    }
    user.username = username;
  }

  if (email) {
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return next(new AppError("Email already exists", 400));
    }
    user.email = email;
  }

  if(bio){
    user.bio = bio;
  }
  //TODO: File upload configuration
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Please provide current password and new password", 400);
  }

  const user = await User.findById(req.user.id);

  if (!user || !(await user.comparePasswords(currentPassword))) {
    throw new AppError("Invalid password", 401);
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  //Counting the number of followers
  const followersCount = await Follow.countDocuments({
    following: userId,
  });

  //Counting the number of following
  const followingCount = await Follow.countDocuments({
    follower: userId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, followersCount, followingCount },
        "User profile retrieved successfully"
      )
    );
});

export const isFollowing = asyncHandler(async (req, res, next) => {
  const { userIdToCheck } = req.params;
  const currentUser = req.user._id;

  const follow = await Follow.findOne({
    follower: currentUser,
    following: userIdToCheck,
  });

  if (follow) {
    return res
      .status(200)
      .json(new ApiResponse(200, true, "User is following"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, false, "User is not following"));
  }
});

export const toggleFollow = asyncHandler(async (req, res, next) => {
  const { userIdToToggle } = req.params;
  const currentUser = req.user.id;

  if (userIdToToggle === currentUser) {
    return next(new AppError("You cannot follow yourself", 400));
  }

  const userToToggle = await User.findById(userIdToToggle);

  if (!userToToggle) {
    return next(new AppError("User not found", 404));
  }

  const follow = await Follow.findOne({
    follower: currentUser,
    following: userIdToToggle,
  });

  if (follow) {
    //Unfollow the user
    await Follow.findByIdAndDelete(follow._id);
    return res
      .status(200)
      .json(new ApiResponse(200, false, "User unfollowed successfully"));
  } else {
    //Follow the user
    await Follow.create({
      follower: currentUser,
      following: userIdToToggle,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, true, "User followed successfully"));
  }
});

export const getFollowers = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const followers = await Follow.find({ following: userId }).populate(
    "follower",
    "username profilePicture"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, followers, "Followers retrieved successfully"));
});

export const getFollowing = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  //LEARN:: Populate in Mongoose (Aggregation)
  const following = await Follow.find({ follower: userId }).populate(
    "following",
    "username profilePicture"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, following, "Following retrieved successfully"));
});
