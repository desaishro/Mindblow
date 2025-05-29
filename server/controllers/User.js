import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify JWT secret is available
const JWT_SECRET = process.env.JWT;
if (!JWT_SECRET) {
  console.error('JWT secret is not configured. Please set JWT environment variable.');
  process.exit(1);
}

// Helper function to safely convert string to ObjectId
const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    console.error("Invalid ObjectId:", id);
    return null;
  }
};

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    // Check if the email is in use
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    // Use async version of bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, JWT_SECRET, {
      expiresIn: "7d"
    });
    
    // Return only necessary user data
    const { password: _, ...userWithoutPassword } = createdUser.toObject();
    return res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Signup error:", error);
    return next(createError(500, "Error during signup process"));
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d"
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return next(createError(500, "Error during login"));
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createError(401, "User ID not found in token"));
    }

    const objectId = toObjectId(userId);
    if (!objectId) {
      return next(createError(400, "Invalid user ID format"));
    }

    const user = await User.findById(objectId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    // Calculate total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { 
        $match: { 
          user: objectId,
          date: { $gte: startToday, $lt: endToday } 
        } 
      },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: { $ifNull: ["$caloriesBurned", 0] } },
        },
      },
    ]);

    // Calculate total no of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: objectId,
      date: { $gte: startToday, $lt: endToday },
    });

    // Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0 && totalWorkouts > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { 
        $match: { 
          user: objectId,
          date: { $gte: startToday, $lt: endToday } 
        } 
      },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: { $ifNull: ["$caloriesBurned", 0] } },
        },
      },
    ]);

    // Format category data for pie chart
    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt || 0,
      label: category._id || 'Uncategorized',
    }));

    const weeks = [];
    const caloriesBurnt = [];
    
    // Get last 7 days data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await Workout.aggregate([
        {
          $match: {
            user: objectId,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: { $ifNull: ["$caloriesBurned", 0] } },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      caloriesBurnt.push(weekData[0]?.totalCaloriesBurnt || 0);
    }

    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts,
      avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    next(createError(500, "Error fetching dashboard data"));
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(createError(401, "User ID not found in token"));
    }

    const objectId = toObjectId(userId);
    if (!objectId) {
      return next(createError(400, "Invalid user ID format"));
    }

    const user = await User.findById(objectId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Parse the date string or use current date
    let date;
    try {
      date = req.query.date ? new Date(req.query.date) : new Date();
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      return next(createError(400, "Invalid date format. Please use YYYY-MM-DD format."));
    }

    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const todaysWorkouts = await Workout.find({
      user: objectId,
      date: { $gte: startOfDay, $lt: endOfDay },
    }).lean();

    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + (workout.caloriesBurned || 0),
      0
    );

    return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
  } catch (err) {
    console.error("Get workouts error:", err);
    next(createError(500, "Error fetching workouts"));
  }
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;
    if (!workoutString) {
      return next(createError(400, "Workout string is missing"));
    }
    // Split workoutString into lines
    const eachworkout = workoutString.split(";").map((line) => line.trim());
    // Check if any workouts start with "#" to indicate categories
    const categories = eachworkout.filter((line) => line.startsWith("#"));
    if (categories.length === 0) {
      return next(createError(400, "No categories found in workout string"));
    }

    const parsedWorkouts = [];
    let currentCategory = "";
    let count = 0;

    // Loop through each line to parse workout details
    await eachworkout.forEach((line) => {
      count++;
      if (line.startsWith("#")) {
        const parts = line?.split("\n").map((part) => part.trim());
        console.log(parts);
        if (parts.length < 5) {
          return next(
            createError(400, `Workout string is missing for ${count}th workout`)
          );
        }

        // Update current category
        currentCategory = parts[0].substring(1).trim();
        // Extract workout details
        const workoutDetails = parseWorkoutLine(parts);
        if (workoutDetails == null) {
          return next(createError(400, "Please enter in proper format "));
        }

        if (workoutDetails) {
          // Add category to workout details
          workoutDetails.category = currentCategory;
          parsedWorkouts.push(workoutDetails);
        }
      } else {
        return next(
          createError(400, `Workout string is missing for ${count}th workout`)
        );
      }
    });

    // Calculate calories burnt for each workout
    await parsedWorkouts.forEach(async (workout) => {
      workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
      await Workout.create({ ...workout, user: userId });
    });

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: parsedWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  const details = {};
  console.log(parts);
  if (parts.length >= 5) {
    details.workoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    console.log(details);
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};
