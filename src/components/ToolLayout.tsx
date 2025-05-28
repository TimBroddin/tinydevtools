import React from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolLayout = ({ title, description, children }: ToolLayoutProps) => {
  return (
    <div className="max-w-5xl ml-5">
      <h1 className="page-heading">{title}</h1>
      <p className="page-description">{description}</p>
      <div className="tool-card">
        {children}
      </div>
    </div>
  );
};

export default ToolLayout;