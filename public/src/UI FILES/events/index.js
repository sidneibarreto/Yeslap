import { firebaseApp } from "app";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export interface Event {
  id: string;
  userId: string;
  name: string;
  date: Date;
  status: "planning" | "confirmed" | "completed" | "cancelled";
  description?: string;
  location?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export async function createEvent(userId: string, data: Omit<Event, "id" | "userId" | "createdAt">) {
  try {
    const eventRef = doc(collection(db, "events"));
    const event: Event = {
      id: eventRef.id,
      userId,
      ...data,
      createdAt: new Date(),
    };

    await setDoc(eventRef, {
      ...event,
      date: Timestamp.fromDate(event.date),
      createdAt: Timestamp.fromDate(event.createdAt),
      updatedAt: event.updatedAt ? Timestamp.fromDate(event.updatedAt) : null,
    });

    return { event, error: null };
  } catch (error: any) {
    return { event: null, error: error.message };
  }
}

export async function getUserEvents(userId: string) {
  try {
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const events: Event[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        ...data,
        id: doc.id,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
      } as Event);
    });

    return { events, error: null };
  } catch (error: any) {
    return { events: [], error: error.message };
  }
}
