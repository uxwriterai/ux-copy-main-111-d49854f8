import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordInputProps { 
  id: string;
  name: string;
  value: string;
  label: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput = ({ 
  id, 
  name,
  value, 
  label, 
  show, 
  onToggleShow,
  onChange
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleShow();
          }}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};