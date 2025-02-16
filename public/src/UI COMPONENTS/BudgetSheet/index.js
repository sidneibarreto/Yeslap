import React from "react";
import { Budget, BudgetItem, addBudgetItem } from "utils/budgets";
import { FileUpload } from "components/FileUpload";
import { generateStoragePath } from "utils/storage";
import { useCurrentUser } from "app";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  budget: Budget;
  onBudgetUpdate: () => void;
}

export function BudgetSheet({ budget, onBudgetUpdate }: Props) {
  const [activeCategory, setActiveCategory] = React.useState(budget.categories[0]);
  const [newItem, setNewItem] = React.useState({
    description: "",
    amount: "",
  });
  const [isAdding, setIsAdding] = React.useState(false);
  const [error, setError] = React.useState("");
  const [uploadingForItem, setUploadingForItem] = React.useState<string | null>(null);
  const { user } = useCurrentUser();

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.description || !newItem.amount) return;

    setIsAdding(true);
    setError("");

    const amount = parseFloat(newItem.amount);
    if (isNaN(amount)) {
      setError("Please enter a valid amount");
      setIsAdding(false);
      return;
    }

    const { error } = await addBudgetItem(budget.id, {
      category: activeCategory,
      description: newItem.description,
      amount,
    });

    if (error) {
      setError(error);
      setIsAdding(false);
      return;
    }

    setNewItem({ description: "", amount: "" });
    setIsAdding(false);
    onBudgetUpdate();
  };

  const getCategoryItems = (category: string) => {
    return budget.items.filter((item) => item.category === category);
  };

  const getCategoryTotal = (category: string) => {
    return getCategoryItems(category).reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
        <div className="border-b px-6 py-3">
          <TabsList className="w-full justify-start space-x-2">
            {budget.categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {budget.categories.map((category) => (
          <TabsContent key={category} value={category} className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {category} Budget Items
                </h3>
                <div className="text-sm text-gray-600">
                  Category Total: ${getCategoryTotal(category).toFixed(2)}
                </div>
              </div>

              <form onSubmit={handleAddItem} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, description: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newItem.amount}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add Item"}
                </Button>
              </form>

              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}

              <div className="space-y-4">
                {getCategoryItems(category).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No items added yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getCategoryItems(category).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            Added {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          {!item.attachment && user && (
                            <div className="flex-1 max-w-xs">
                              <FileUpload
                                storagePath={generateStoragePath(
                                  user.uid,
                                  budget.eventId,
                                  `quote-${item.id}`
                                )}
                                onFileUploaded={async (fileInfo) => {
                                  setUploadingForItem(item.id);
                                  const { error } = await addBudgetItem(budget.id, {
                                    ...item,
                                    attachment: fileInfo,
                                  });
                                  if (error) setError(error);
                                  setUploadingForItem(null);
                                  onBudgetUpdate();
                                }}
                                onError={setError}
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              ${item.amount.toFixed(2)}
                            </div>
                            {item.attachment && (
                              <a
                                href={item.attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View {item.attachment.name}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="border-t px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">Total Budget</div>
          <div className="text-lg font-semibold text-gray-900">
            ${budget.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
