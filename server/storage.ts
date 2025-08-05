import {
  users,
  trainingModules,
  quizzes,
  quizQuestions,
  userProgress,
  quizAttempts,
  scripts,
  practiceRecordings,
  performanceMetrics,
  type User,
  type UpsertUser,
  type TrainingModule,
  type Quiz,
  type QuizQuestion,
  type UserProgress,
  type QuizAttempt,
  type Script,
  type PracticeRecording,
  type PerformanceMetrics,
  type InsertUserProgress,
  type InsertQuizAttempt,
  type InsertPracticeRecording,
  type InsertPerformanceMetrics,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Training modules
  getTrainingModules(): Promise<TrainingModule[]>;
  getTrainingModule(id: number): Promise<TrainingModule | undefined>;
  
  // Quizzes
  getQuizzesByModule(moduleId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  
  // User progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserModuleProgress(userId: string, moduleId: number): Promise<UserProgress | undefined>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Quiz attempts
  submitQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: string, quizId: number): Promise<QuizAttempt[]>;
  
  // Scripts
  getScripts(): Promise<Script[]>;
  getScriptsByCategory(category: string): Promise<Script[]>;
  
  // Practice recordings
  savePracticeRecording(recording: InsertPracticeRecording): Promise<PracticeRecording>;
  getUserPracticeRecordings(userId: string): Promise<PracticeRecording[]>;
  
  // Performance metrics
  savePerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics>;
  getUserPerformanceMetrics(userId: string): Promise<PerformanceMetrics[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Training modules
  async getTrainingModules(): Promise<TrainingModule[]> {
    return await db.select().from(trainingModules).orderBy(asc(trainingModules.day), asc(trainingModules.orderIndex));
  }

  async getTrainingModule(id: number): Promise<TrainingModule | undefined> {
    const [module] = await db.select().from(trainingModules).where(eq(trainingModules.id, id));
    return module;
  }

  // Quizzes
  async getQuizzesByModule(moduleId: number): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(asc(quizQuestions.orderIndex));
  }

  // User progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserModuleProgress(userId: string, moduleId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(
      and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId))
    );
    return progress;
  }

  async updateUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserModuleProgress(progressData.userId!, progressData.moduleId!);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({ ...progressData, updatedAt: new Date() })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values(progressData)
        .returning();
      return created;
    }
  }

  // Quiz attempts
  async submitQuizAttempt(attemptData: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values(attemptData)
      .returning();
    return attempt;
  }

  async getUserQuizAttempts(userId: string, quizId: number): Promise<QuizAttempt[]> {
    return await db.select().from(quizAttempts).where(
      and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId))
    ).orderBy(desc(quizAttempts.createdAt));
  }

  // Scripts
  async getScripts(): Promise<Script[]> {
    return await db.select().from(scripts).orderBy(asc(scripts.category), asc(scripts.title));
  }

  async getScriptsByCategory(category: string): Promise<Script[]> {
    return await db.select().from(scripts).where(eq(scripts.category, category));
  }

  // Practice recordings
  async savePracticeRecording(recordingData: InsertPracticeRecording): Promise<PracticeRecording> {
    const [recording] = await db
      .insert(practiceRecordings)
      .values(recordingData)
      .returning();
    return recording;
  }

  async getUserPracticeRecordings(userId: string): Promise<PracticeRecording[]> {
    return await db.select().from(practiceRecordings).where(eq(practiceRecordings.userId, userId)).orderBy(desc(practiceRecordings.createdAt));
  }

  // Performance metrics
  async savePerformanceMetrics(metricsData: InsertPerformanceMetrics): Promise<PerformanceMetrics> {
    const [metrics] = await db
      .insert(performanceMetrics)
      .values(metricsData)
      .returning();
    return metrics;
  }

  async getUserPerformanceMetrics(userId: string): Promise<PerformanceMetrics[]> {
    return await db.select().from(performanceMetrics).where(eq(performanceMetrics.userId, userId)).orderBy(desc(performanceMetrics.date));
  }
}

export const storage = new DatabaseStorage();
