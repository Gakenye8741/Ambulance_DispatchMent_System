import { pgTable, serial, varchar, integer, timestamp, text, boolean, pgEnum } from "drizzle-orm/pg-core";

// ========== ENUMS ==========
export const userRoleEnum = pgEnum("user_role", ["patient", "ambulance_driver", "hospital_admin", "system_admin"]);
export const emergencyLevelEnum = pgEnum("emergency_level", ["critical", "urgent", "non_urgent"]);
export const ambulanceStatusEnum = pgEnum("ambulance_status", ["available", "on_trip", "unavailable"]);
export const tripStatusEnum = pgEnum("trip_status", ["pending", "en_route", "picked_up", "arrived", "cancelled"]);
export const actionTypeEnum = pgEnum("action_type", ["emergency_request", "login", "logout", "joker_detected", "trip_update", "other"]);

// ========== USERS ==========
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("patient"),
  nationalId: varchar("national_id", { length: 20 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== HOSPITALS ==========
export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  address: text("address"),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 150 }),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== HOSPITAL ADMINS ==========
export const hospitalAdmins = pgTable("hospital_admins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
});

// ========== AMBULANCES ==========
export const ambulances = pgTable("ambulances", {
  id: serial("id").primaryKey(),
  hospitalId: integer("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  plateNumber: varchar("plate_number", { length: 20 }).unique().notNull(),
  driverId: integer("driver_id").references(() => users.id, { onDelete: "set null" }),
  status: ambulanceStatusEnum("status").default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== EMERGENCY REQUESTS ==========
export const emergencyRequests = pgTable("emergency_requests", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }),
  ambulanceId: integer("ambulance_id").references(() => ambulances.id, { onDelete: "set null" }),
  emergencyLevel: emergencyLevelEnum("emergency_level").notNull(),
  description: text("description"),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== TRIPS ==========
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => emergencyRequests.id, { onDelete: "cascade" }).notNull(),
  ambulanceId: integer("ambulance_id").references(() => ambulances.id, { onDelete: "cascade" }).notNull(),
  driverId: integer("driver_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: tripStatusEnum("status").default("pending").notNull(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ========== PENALTIES ==========
export const penalties = pgTable("penalties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reason: text("reason").notNull(),
  count: integer("count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// ========== ACTIVITY LOGS ==========
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  actionType: actionTypeEnum("action_type").notNull(),
  description: text("description"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});
