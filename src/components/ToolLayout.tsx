import React from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolLayout = ({ title, description, children }: ToolLayoutProps) => {
  return (
    <div className="max-w-5xl ml-5">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 mb-6 text-muted-foreground">{description}</p>
      <div className="p-6 transition-all duration-200 bg-card rounded-lg shadow-sm border-border border">
        {children}
      </div>
    </div>
  );
};

export default ToolLayout;