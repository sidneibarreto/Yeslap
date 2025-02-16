import React from "react";
import { useCurrentUser } from "app";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "components/CreateEventDialog";
import { EventCard } from "components/EventCard";
import { createEvent, getUserEvents, type Event } from "utils/events";

export default function Dashboard() {
  const { user, loading: authLoading } = useCurrentUser();
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (user) {
      const loadEvents = async () => {
        setLoading(true);
        const { events, error } = await getUserEvents(user.uid);
        setEvents(events);
        setError(error || "");
        setLoading(false);
      };

      loadEvents();
    }
  }, [user]);

  const handleCreateEvent = async (data: Omit<Event, "id" | "userId" | "createdAt">) => {
    if (!user) return;

    setIsCreating(true);
    setError("");

    const { event, error } = await createEvent(user.uid, data);

    if (error) {
      setError(error);
      setIsCreating(false);
      return;
    }

    if (event) {
      setEvents((prev) => [event, ...prev]);
    }

    setIsCreating(false);
  };

  const handleEventClick = (event: Event) => {
    navigate(`/Event/${event.id}`);
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => navigate("/Profile")}
              className="text-gray-600 hover:text-gray-900"
            >
              Profile Settings
            </Button>
          </div>

          <div className="flex justify-end mb-6">
            <CreateEventDialog onSubmit={handleCreateEvent} isLoading={isCreating} />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first event to get started with EventFlow Pro.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
