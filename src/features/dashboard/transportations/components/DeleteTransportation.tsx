import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/shared/api/instance";
import { Trash } from "lucide-react";

export function DeleteTransportation({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) {
  const handleDelete = async () => {
    if (!confirm("Ви впевнені, що хочете видалити цей запис?")) return;
    try {
      await api.delete(`/transportations/${id}`);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Помилка при видаленні");
    }
  };

  return (
    <Button size="icon-sm" variant="outline" onClick={handleDelete}>
      <Trash color="red" />
    </Button>
  );
}
