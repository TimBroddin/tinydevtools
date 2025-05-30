import ToolLayout from "../../components/ToolLayout";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const DOH_SERVERS = [
  { name: "Cloudflare", url: "https://cloudflare-dns.com/dns-query" },
  { name: "Google", url: "https://dns.google/resolve" },
  // Add more DoH servers here
];

const RECORD_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "PTR",
  "SOA",
  "SRV",
  "TXT",
  // Add more record types if needed
];

export default function DNSTool() {
  const [domain, setDomain] = useState("");
  const [selectedServer, setSelectedServer] = useState(DOH_SERVERS[0].url);
  const [selectedRecordType, setSelectedRecordType] = useState(RECORD_TYPES[0]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["dnsLookup", domain, selectedServer, selectedRecordType],
    queryFn: async () => {
      if (!domain) return null;
      const params = new URLSearchParams({
        name: domain,
        type: selectedRecordType,
      });
      const response = await fetch(`${selectedServer}?${params}`, {
        headers: {
          accept: "application/dns-json",
        },
      });
      if (!response.ok) {
        throw new Error(`DNS query failed with status: ${response.status}`);
      }
      return response.json();
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
      title="DNS Lookup Tool"
      description="Perform DNS lookups using various DoH servers and record types."
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

        <div className="space-y-2">
          <Label htmlFor="doh-server">DoH Server</Label>
          <Select
            value={selectedServer}
            onValueChange={(value) => {
              setSelectedServer(value);
              setIsSubmitted(false);
            }}
          >
            <SelectTrigger id="doh-server">
              <SelectValue placeholder="Select DoH Server" />
            </SelectTrigger>
            <SelectContent>
              {DOH_SERVERS.map((server) => (
                <SelectItem key={server.name} value={server.url}>
                  {server.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="record-type">Record Type</Label>
          <Select
            value={selectedRecordType}
            onValueChange={(value) => {
              setSelectedRecordType(value);
              setIsSubmitted(false);
            }}
          >
            <SelectTrigger id="record-type">
              <SelectValue placeholder="Select Record Type" />
            </SelectTrigger>
            <SelectContent>
              {RECORD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={!domain || isLoading}
        >
          {isLoading ? "Querying..." : "Query DNS"}
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
                  <p>{(error as Error).message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSubmitted && !isLoading && !error && data && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Results:
            </h3>
            <pre className="mt-2 overflow-x-auto rounded-md bg-gray-100 p-4 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">About This Tool</h3>
          <p className="text-sm text-muted-foreground">
            This tool allows you to perform DNS lookups using DNS over HTTPS (DoH)
            servers. You can specify the domain name, choose a DoH server, and
            select the DNS record type to query.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            DoH enhances privacy and security by encrypting DNS queries and
            responses, preventing eavesdropping and manipulation by third parties.
          </p>
        </div>
      </form>
    </ToolLayout>
  );
}
