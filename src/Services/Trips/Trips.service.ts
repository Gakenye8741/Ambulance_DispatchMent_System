import { desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import { TInsertTrip, TSelectTrip, trips } from "../../drizzle/schema";

// 🚑 Get All Trips
export const getAllTripsServices = async (): Promise<TSelectTrip[]> => {
  return await db.query.trips.findMany({
    orderBy: [desc(trips.id)],
    with: {
        request:  true,
        ambulance: true,
        driver: true
    }
  });
};

// 🗑️ Delete Trip (hard delete)
export const deleteTripServices = async (id: number): Promise<string> => {
  await db.delete(trips).where(eq(trips.id, id));
  return "🗑️✅ Trip Deleted Successfully 🎉";
};

// ✏️ Update Trip
export const updateTripServices = async (
  id: number,
  trip: Partial<TInsertTrip>
): Promise<string> => {
  const updatedTrip = await db
    .update(trips)
    .set({ ...trip, updatedAt: new Date() })
    .where(eq(trips.id, id))
    .returning();

  if (!updatedTrip.length) {
    throw new Error("⚠️❌ Trip not found");
  }

  return "✏️✅ Trip Updated Successfully 🎉";
};

// 🔍 Get Trip by ID
export const getTripByIdServices = async (
  id: number
): Promise<TSelectTrip | undefined> => {
  return await db.query.trips.findFirst({
    where: eq(trips.id, id),
  });
};

// ➕ Register (Insert) a Trip
export const registerTripService = async (
  trip: TInsertTrip
): Promise<string> => {
  await db.insert(trips).values(trip).returning();
  return "🚑✅ Trip Created Successfully 🎉";
};

// ❌ Cancel Trip (soft update status to cancelled)
export const cancelTripService = async (id: number): Promise<string> => {
  const cancelledTrip = await db
    .update(trips)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(trips.id, id))
    .returning();

  if (!cancelledTrip.length) {
    throw new Error("⚠️❌ Trip not found");
  }

  return "❌🚑 Trip Cancelled Successfully 🎉";
};
