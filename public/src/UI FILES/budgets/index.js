import { firebaseApp } from "app";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  attachment?: {
    path: string;
    name: string;
    url: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface Budget {
  id: string;
  eventId: string;
  userId: string;
  items: BudgetItem[];
  categories: string[];
  totalAmount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export const DEFAULT_CATEGORIES = ["Sound", "Lighting", "Image"];

export async function createBudget(userId: string, eventId: string) {
  try {
    const budgetRef = doc(collection(db, "budgets"));
    const budget: Budget = {
      id: budgetRef.id,
      eventId,
      userId,
      items: [],
      categories: DEFAULT_CATEGORIES,
      totalAmount: 0,
      createdAt: new Date(),
    };

    await setDoc(budgetRef, budget);

    return { budget, error: null };
  } catch (error: any) {
    return { budget: null, error: error.message };
  }
}

export async function getEventBudget(eventId: string, userId: string) {
  try {
    const budgetsRef = collection(db, "budgets");
    const q = query(
      budgetsRef,
      where("eventId", "==", eventId),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return { budget: null, error: null };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data() as Budget;
    const budget: Budget = {
      ...data,
      id: doc.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
    };

    return { budget, error: null };
  } catch (error: any) {
    return { budget: null, error: error.message };
  }
}

export async function addBudgetItem(budgetId: string, item: Omit<BudgetItem, "id" | "createdAt">) {
  try {
    const budgetRef = doc(db, "budgets", budgetId);
    const budgetDoc = await getDocs(query(collection(db, "budgets"), where("id", "==", budgetId)));
    
    if (budgetDoc.empty) {
      return { item: null, error: "Budget not found" };
    }

    const currentBudget = budgetDoc.docs[0].data() as Budget;
    const newItem: BudgetItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    await setDoc(
      budgetRef,
      {
        items: [...currentBudget.items, newItem],
        totalAmount: currentBudget.totalAmount + item.amount,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return { item: newItem, error: null };
  } catch (error: any) {
    return { item: null, error: error.message };
  }
}
