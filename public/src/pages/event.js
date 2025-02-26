import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentUser } from "app";
import { Button } from "@/components/ui/button";
import { BudgetSheet } from "components/BudgetSheet";
import { getEvent } from "utils/events";
import { getEventBudget, createBudget } from "utils/budgets";
import type { Event as EventType } from "utils/events";
import type { Budget } from "utils/budgets";

export default function Event() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useCurrentUser();
  const [event, setEvent] = React.useState<EventType | null>(null);
  const [budget, setBudget] = React.useState<Budget | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (user && id) {
      const loadEventAndBudget = async () => {
        setLoading(true);
        setError("");

        // Load event
        const { event: loadedEvent, error: eventError } = await getEvent(id);
        if (eventError) {
          setError(eventError);
          setLoading(false);
          return;
        }

        if (!loadedEvent) {
          setError("Event not found");
          setLoading(false);
          return;
        }

        setEvent(loadedEvent);

        // Load or create budget
        const { budget: loadedBudget, error: budgetError } = await getEventBudget(
          id,
          user.uid
        );

        if (budgetError) {
          setError(budgetError);
          setLoading(false);
          return;
        }

        if (!loadedBudget) {
          // Create new budget if none exists
          const { budget: newBudget, error: createError } = await createBudget(
            user.uid,
            id
          );

          if (createError) {
            setError(createError);
            setLoading(false);
            return;
          }

          setBudget(newBudget);
        } else {
          setBudget(loadedBudget);
        }

        setLoading(false);
      };

      loadEventAndBudget();
    }
  }, [user, id]);

  const handleBudgetUpdate = React.useCallback(async () => {
    if (!user || !id) return;

    const { budget: updatedBudget, error: budgetError } = await getEventBudget(
      id,
      user.uid
    );

    if (budgetError) {
      setError(budgetError);
      return;
    }

    if (updatedBudget) {
      setBudget(updatedBudget);
    }
  }, [user, id]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!event || !budget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate("/Dashboard")}
                className="mb-2"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {event.name}
              </h1>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <div className="text-sm text-gray-600">
              Created {new Date(event.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-8">
            <BudgetSheet budget={budget} onBudgetUpdate={handleBudgetUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

