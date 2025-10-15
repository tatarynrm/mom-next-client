import Header from "@/components/header/Header";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default DashboardLayout;
