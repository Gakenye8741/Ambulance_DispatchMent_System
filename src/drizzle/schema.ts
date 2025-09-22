import { pgTable, serial, varchar, integer, timestamp, text, boolean, pgEnum} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ========== ENUMS ==========
export const userRoleEnum = pgEnum("user_role", ["patient", "ambulance_driver", "hospital_admin", "system_admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "deactivated", "blacklisted"]);
export const emergencyLevelEnum = pgEnum("emergency_level", ["critical", "urgent", "non_urgent"]);
export const ambulanceStatusEnum = pgEnum("ambulance_status", ["available", "on_trip", "unavailable"]);
export const tripStatusEnum = pgEnum("trip_status", ["pending", "en_route", "picked_up", "arrived", "cancelled"]);
export const actionTypeEnum = pgEnum("action_type", [
  // 🔐 Auth
  "login",
  "logout",

  // 👤 Users
  "user_create",
  "user_update",
  "user_delete",
  "user_read",

  // 🏥 Hospitals
  "hospital_create",
  "hospital_update",
  "hospital_delete",

  // 👨‍⚕️ Hospital Admins
  "hospital_admin_create",
  "hospital_admin_update",
  "hospital_admin_delete",

  // 🚑 Ambulances
  "ambulance_create",
  "ambulance_update",
  "ambulance_delete",

  // 📟 Emergency Requests
  "emergency_request_create",
  "emergency_request_update",
  "emergency_request_delete",

  // 🚨 Trips
  "trip_create",
  "trip_update",
  "trip_delete",
  "trip_cancel",

  // ⚖️ Penalties
  "penalty_create",
  "penalty_update",
  "penalty_delete",

  // 🕵️ System / Special
  "joker_detected",
  "other"
]);


// ==========================
// TABLES
// ==========================

export const users = pgTable("users", {
   id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("patient"),
  nationalId: varchar("national_id", { length: 20 }).unique(),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

export const hospitalAdmins = pgTable("hospital_admins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
});

export const ambulances = pgTable("ambulances", {
  id: serial("id").primaryKey(),
  hospitalId: integer("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  plateNumber: varchar("plate_number", { length: 20 }).unique().notNull(),
  driverId: integer("driver_id").references(() => users.id, { onDelete: "set null" }),
  status: ambulanceStatusEnum("status").default("available").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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

export const penalties = pgTable("penalties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  reason: text("reason").notNull(),
  count: integer("count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  actionType: actionTypeEnum("action_type").notNull(),
  description: text("description"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==========================
// RELATIONS
// ==========================

export const usersRelations = relations(users, ({ many }) => ({
  hospitalAdmins: many(hospitalAdmins),
  ambulances: many(ambulances),
  emergencyRequests: many(emergencyRequests),
  trips: many(trips),
  penalties: many(penalties),
  activityLogs: many(activityLogs),
}));

export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  hospitalAdmins: many(hospitalAdmins),
  ambulances: many(ambulances),
  emergencyRequests: many(emergencyRequests),
}));

export const hospitalAdminsRelations = relations(hospitalAdmins, ({ one }) => ({
  user: one(users, { fields: [hospitalAdmins.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [hospitalAdmins.hospitalId], references: [hospitals.id] }),
}));

export const ambulancesRelations = relations(ambulances, ({ one, many }) => ({
  hospital: one(hospitals, { fields: [ambulances.hospitalId], references: [hospitals.id] }),
  driver: one(users, { fields: [ambulances.driverId], references: [users.id] }),
  trips: many(trips),
  emergencyRequests: many(emergencyRequests),
}));

export const emergencyRequestsRelations = relations(emergencyRequests, ({ one , many}) => ({
  patient: one(users, { fields: [emergencyRequests.patientId], references: [users.id] }),
  hospital: one(hospitals, { fields: [emergencyRequests.hospitalId], references: [hospitals.id] }),
  ambulance: one(ambulances, { fields: [emergencyRequests.ambulanceId], references: [ambulances.id] }),
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one }) => ({
  request: one(emergencyRequests, { fields: [trips.requestId], references: [emergencyRequests.id] }),
  ambulance: one(ambulances, { fields: [trips.ambulanceId], references: [ambulances.id] }),
  driver: one(users, { fields: [trips.driverId], references: [users.id] }),
}));

export const penaltiesRelations = relations(penalties, ({ one }) => ({
  user: one(users, { fields: [penalties.userId], references: [users.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

// ==========================
// TYPES
// ==========================

export type TSelectUser = typeof users.$inferSelect;
export type TInsertUser = typeof users.$inferInsert;

export type TSelectHospital = typeof hospitals.$inferSelect;
export type TInsertHospital = typeof hospitals.$inferInsert;

export type TSelectHospitalAdmin = typeof hospitalAdmins.$inferSelect;
export type TInsertHospitalAdmin = typeof hospitalAdmins.$inferInsert;

export type TSelectAmbulance = typeof ambulances.$inferSelect;
export type TInsertAmbulance = typeof ambulances.$inferInsert;

export type TSelectEmergencyRequest = typeof emergencyRequests.$inferSelect;
export type TInsertEmergencyRequest = typeof emergencyRequests.$inferInsert;

export type TSelectTrip = typeof trips.$inferSelect;
export type TInsertTrip = typeof trips.$inferInsert;

export type TSelectPenalty = typeof penalties.$inferSelect;
export type TInsertPenalty = typeof penalties.$inferInsert;

export type TSelectActivityLog = typeof activityLogs.$inferSelect;
export type TInsertActivityLog = typeof activityLogs.$inferInsert;
