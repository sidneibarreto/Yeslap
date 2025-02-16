import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

export function RoleSelector({ selectedRole, onRoleChange }: Props) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose your role</h3>
      <RadioGroup
        value={selectedRole}
        onValueChange={onRoleChange}
        className="gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="producer" id="producer" />
          <Label htmlFor="producer" className="text-base">
            Producer
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="agency" id="agency" />
          <Label htmlFor="agency" className="text-base">
            Agency
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
