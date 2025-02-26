import { config } from "dotenv";
import User from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    username: "Emma Thompson",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    username: "Olivia Miller",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    username: "Sophia Davis",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    username: "Ava Wilson",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    username: "Isabella Brown",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    username: "Mia Johnson",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    username: "Charlotte Williams",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    username: "Amelia Garcia",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    username: "James Anderson",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    username: "William Clark",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    username: "Benjamin Taylor",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    username: "Lucas Moore",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    username: "Henry Jackson",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    username: "Alexander Martin",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    username: "Daniel Rodriguez",
    password: bcrypt.hashSync("12345678", 12),
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();