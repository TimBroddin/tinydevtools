import ToolLayout from "../../components/ToolLayout";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchWhoisData } from './server';

export default function WhoisTool() {
  const [domain, setDomain] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["whoisLookup", domain],
    queryFn: async () => {
      if (!domain) return null;
      // Directly call the server function
      return fetchWhoisData({ data: { domain } });
    },
    enabled: false,
    retry: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (domain) {
      setIsSubmitted(true);
      refetch();
    }
  };

  return (
    <ToolLayout
      title="WHOIS Lookup Tool"
      description="Perform WHOIS lookups for domain names."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="domain">Domain Name</Label>
          <Input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setIsSubmitted(false);
            }}
            placeholder="e.g., example.com"
          />
        </div>

        <Button
          type="submit"
          disabled={!domain || isLoading}
        >
          {isLoading ? "Looking up..." : "Lookup WHOIS"}
        </Button>

        {isSubmitted && isLoading && (
          <div className="mt-4 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        )}

        {isSubmitted && !isLoading && error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSubmitted && !isLoading && !error && data && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              WHOIS Information:
            </h3>
            <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-4 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About This Tool</h3>
          <p className="text-sm text-muted-foreground">
            This tool allows you to perform WHOIS lookups for domain names to retrieve registration information.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The WHOIS protocol is used to query databases that store information about the registered users or assignees of an Internet resource, such as a domain name or an IP address block.
          </p>
        </div>
      </form>
    </ToolLayout>
  );
}
