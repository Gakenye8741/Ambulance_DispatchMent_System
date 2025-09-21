
import db from "./db";
import {
  users,
  hospitals,
  hospitalAdmins,
  ambulances,
  emergencyRequests,
  trips,
  penalties,
  activityLogs,
  userRoleEnum,
  userStatusEnum,
  emergencyLevelEnum,
  ambulanceStatusEnum,
  tripStatusEnum,
  actionTypeEnum
} from "./schema";

async function seed() {
  // ========== USERS ==========
  const [patient, driver, hospitalAdmin, systemAdmin] = await Promise.all([
    db.insert(users).values({
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+254700000001",
      passwordHash: "hashedpassword1",
      role: "patient",
      status: "active",
    }).returning(),
    db.insert(users).values({
      id: 2,
      fullName: "Mary Smith",
      email: "mary@example.com",
      phone: "+254700000002",
      passwordHash: "hashedpassword2",
      role: "ambulance_driver",
      status: "active",
    }).returning(),
    db.insert(users).values({
      id: 3,
      fullName: "Alice Admin",
      email: "alice@example.com",
      phone: "+254700000003",
      passwordHash: "hashedpassword3",
      role: "hospital_admin",
      status: "active",
    }).returning(),
    db.insert(users).values({
      id: 4,
      fullName: "System Admin",
      email: "sysadmin@example.com",
      phone: "+254700000004",
      passwordHash: "hashedpassword4",
      role: "system_admin",
      status: "active",
    }).returning(),
  ]);

  // ========== HOSPITALS ==========
  const [hospital1] = await db.insert(hospitals).values({
    name: "Nairobi General Hospital",
    address: "123 Nairobi St",
    latitude: "-1.286389",
    longitude: "36.817223",
    phone: "+254711000111",
    email: "info@nairobihospital.com",
    isPublic: true,
  }).returning();

  // ========== HOSPITAL ADMINS ==========
  await db.insert(hospitalAdmins).values({
    userId: hospitalAdmin[0].id,
    hospitalId: hospital1.id,
  });

  // ========== AMBULANCES ==========
  const [ambulance1] = await db.insert(ambulances).values({
    hospitalId: hospital1.id,
    plateNumber: "KAA-001A",
    driverId: driver[0].id,
    status: "available",
  }).returning();

  // ========== EMERGENCY REQUESTS ==========
  const [emergencyRequest1] = await db.insert(emergencyRequests).values({
    patientId: patient[0].id,
    hospitalId: hospital1.id,
    ambulanceId: ambulance1.id,
    emergencyLevel: "critical",
    description: "Severe injury from accident",
    latitude: "-1.286389",
    longitude: "36.817223",
    status: "pending",
  }).returning();

  // ========== TRIPS ==========
  await db.insert(trips).values({
    requestId: emergencyRequest1.id,
    ambulanceId: ambulance1.id,
    driverId: driver[0].id,
    status: "pending",
  });

  // ========== PENALTIES ==========
  await db.insert(penalties).values({
    userId: patient[0].id,
    reason: "Late payment",
    count: 1,
  });

  // ========== ACTIVITY LOGS ==========
  await db.insert(activityLogs).values([
    {
      userId: patient[0].id,
      actionType: "login",
      description: "Patient logged in",
      ipAddress: "192.168.1.10",
    },
    {
      userId: driver[0].id,
      actionType: "trip_update",
      description: "Ambulance en route",
      ipAddress: "192.168.1.11",
    },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
});
