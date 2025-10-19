import { type User, type InsertUser, type GameState, type UpdateGameState } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getGameState(): Promise<GameState>;
  updateGameState(updates: UpdateGameState): Promise<GameState>;
  resetGameState(): Promise<GameState>;
}

const initialGameState: GameState = {
  homeTeam: {
    name: "Chiefs",
    score: 0,
    record: "3-3",
    logo: "🏈",
    primaryColor: "#E31837",
    timeouts: 3,
    flags: 0
  },
  awayTeam: {
    name: "Raiders",
    score: 0,
    record: "2-4",
    logo: "🏴‍☠️",
    primaryColor: "#000000",
    timeouts: 3,
    flags: 0
  },
  quarter: 1,
  timeRemaining: 900,
  isClockRunning: false,
  possession: null,
  down: 1,
  yardsToGo: 10,
  fieldPosition: 50,
  ballOn: "away",
  activeFlag: null,
};

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gameState: GameState;

  constructor() {
    this.users = new Map();
    this.gameState = { ...initialGameState };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameState(): Promise<GameState> {
    return { ...this.gameState };
  }

  async updateGameState(updates: UpdateGameState): Promise<GameState> {
    this.gameState = {
      ...this.gameState,
      ...updates,
    };
    return { ...this.gameState };
  }

  async resetGameState(): Promise<GameState> {
    this.gameState = {
      homeTeam: {
        name: "Chiefs",
        score: 0,
        record: "3-3",
        logo: "🏈",
        primaryColor: "#E31837",
        timeouts: 3,
        flags: 0
      },
      awayTeam: {
        name: "Raiders",
        score: 0,
        record: "2-4",
        logo: "🏴‍☠️",
        primaryColor: "#000000",
        timeouts: 3,
        flags: 0
      },
      quarter: 1,
      timeRemaining: 900,
      isClockRunning: false,
      possession: null,
      down: 1,
      yardsToGo: 10,
      fieldPosition: 50,
      ballOn: "away",
      activeFlag: null,
    };
    return { ...this.gameState };
  }
}

export const storage = new MemStorage();