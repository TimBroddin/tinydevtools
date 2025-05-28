import React from 'react';
import { Link } from '@tanstack/react-router';
import { Clock, FileJson, FileCode } from 'lucide-react';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

const ToolCard = ({ icon, title, description, to }: ToolCardProps) => {
  return (
    <Link
      to={to}
      className="tool-card hover:shadow-md hover:border-primary/20 group cursor-pointer"
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
};

const HomePage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Developer Tools for Daily Tasks
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Simple, fast, and effective tools to streamline your development workflow
        </p>
      </div>

    </div>
  );
};

export default HomePage;