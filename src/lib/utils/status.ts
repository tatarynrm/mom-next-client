// src/lib/utils/status.ts
export const getStatusColorClass = (status: number) => {
  switch (status) {
    case 1:
      return "bg-gray-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-red-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};