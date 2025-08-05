import { Router } from "express";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import bcrypt from "bcryptjs";
import { z } from "zod";

const router = Router();

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    // For development, using James's account
    const user = await storage.getUser("36142437");
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await storage.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Create user
const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(["trainee", "instructor", "admin"]).default("trainee"),
});

router.post("/users", isAdmin, async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user
    const user = await storage.createAdminUser({
      ...validatedData,
      password: hashedPassword,
    });
    
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// Update user
const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["trainee", "instructor", "admin"]).optional(),
});

router.put("/users/:id", isAdmin, async (req, res) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const user = await storage.updateUser(req.params.id, validatedData);
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Update user password
const updatePasswordSchema = z.object({
  password: z.string().min(6),
});

router.put("/users/:id/password", isAdmin, async (req, res) => {
  try {
    const validatedData = updatePasswordSchema.parse(req.body);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    await storage.updateUser(req.params.id, { password: hashedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
});

// Delete user
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    // Prevent self-deletion
    const currentUserId = req.user?.claims?.sub;
    if (currentUserId === req.params.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    await storage.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;