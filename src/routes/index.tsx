import { createFileRoute, Link } from '@tanstack/react-router'
import { Terminal, Code, Zap, ArrowRight, Github } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex ">
      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="relative">
          {/* Logo and title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-30" />
              <div className="relative bg-gradient-to-r from-primary to-accent p-4 rounded-xl">
                <Terminal className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              tinydev.tools
            </h1>
          </div>
          
          {/* Tagline */}
          <div className="mb-8">
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 font-mono">
              <span className="text-primary">$</span> tiny tools for big productivity
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              A curated collection of lightweight developer utilities. 
              No bloat, no tracking, just tools that work.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            {[
              { icon: Zap, text: "Instant" },
              { icon: Code, text: "Local" },
              { icon: Terminal, text: "Simple" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center justify-center gap-2 text-muted-foreground">
                  <IconComponent className="w-5 h-5" />
                  <span className="font-mono text-sm">{feature.text}</span>
                </div>
              );
            })}
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/converters/unix-time"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-mono text-sm hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>./start</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href="https://github.com/timbroddin/tinydevtools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
            >
              <Github className="w-4 h-4" />
              <span>view source</span>
            </a>
          </div>
          
          {/* Terminal hint */}
          <div className="mt-16 text-xs text-muted-foreground/60 font-mono">
            <span className="text-primary">tip:</span> use the sidebar to navigate tools →
          </div>
        </div>
      </div>
    </div>
  );
}
