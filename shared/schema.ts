import { sql } from 'drizzle-orm';
import { 
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  serial
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("trainee"), // trainee, instructor, admin
  password: varchar("password"), // For admin-created users
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training modules
export const trainingModules = pgTable("training_modules", {
  id: serial("id").primaryKey(),
  day: integer("day").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  isLocked: boolean("is_locked").default(true),
  videoUrl: varchar("video_url"),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => trainingModules.id),
  title: varchar("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").default(80),
  timeLimit: integer("time_limit"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // array of options
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
  orderIndex: integer("order_index").notNull(),
});

// User progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  moduleId: integer("module_id").references(() => trainingModules.id),
  status: varchar("status").default("not_started"), // not_started, in_progress, completed
  score: integer("score"),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quiz attempts
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  quizId: integer("quiz_id").references(() => quizzes.id),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(), // array of user answers
  passed: boolean("passed").notNull(),
  timeSpent: integer("time_spent"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Scripts library
export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  category: varchar("category").notNull(), // post_storm, annual_wellness, insurance_assistance, etc.
  content: text("content").notNull(),
  audioUrl: varchar("audio_url"),
  tags: jsonb("tags"), // array of tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Practice call recordings
export const practiceRecordings = pgTable("practice_recordings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  scenario: varchar("scenario").notNull(),
  audioUrl: varchar("audio_url"),
  score: integer("score"),
  feedback: text("feedback"),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Performance metrics
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  date: timestamp("date").defaultNow(),
  dailyDials: integer("daily_dials").default(0),
  contactRate: decimal("contact_rate", { precision: 5, scale: 2 }).default("0"),
  inspectionsSet: integer("inspections_set").default(0),
  inspectionToDealRate: decimal("inspection_to_deal_rate", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  quizAttempts: many(quizAttempts),
  practiceRecordings: many(practiceRecordings),
  performanceMetrics: many(performanceMetrics),
}));

export const trainingModulesRelations = relations(trainingModules, ({ many }) => ({
  quizzes: many(quizzes),
  userProgress: many(userProgress),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  module: one(trainingModules, {
    fields: [quizzes.moduleId],
    references: [trainingModules.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  module: one(trainingModules, {
    fields: [userProgress.moduleId],
    references: [trainingModules.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));

export const practiceRecordingsRelations = relations(practiceRecordings, ({ one }) => ({
  user: one(users, {
    fields: [practiceRecordings.userId],
    references: [users.id],
  }),
}));

export const performanceMetricsRelations = relations(performanceMetrics, ({ one }) => ({
  user: one(users, {
    fields: [performanceMetrics.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeRecordingSchema = createInsertSchema(practiceRecordings).omit({
  id: true,
  createdAt: true,
});

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type TrainingModule = typeof trainingModules.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Script = typeof scripts.$inferSelect;
export type PracticeRecording = typeof practiceRecordings.$inferSelect;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type InsertPracticeRecording = z.infer<typeof insertPracticeRecordingSchema>;
export type InsertPerformanceMetrics = z.infer<typeof insertPerformanceMetricsSchema>;
