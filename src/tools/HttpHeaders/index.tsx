import ToolLayout from "../../components/ToolLayout";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const fetchHttpHeaders = createServerFn({ method: 'POST'}).validator(
    (url: string) => z.string().url().parse(url)
).handler(async ({ data: url }) => {
  if (!url) {
    throw new Error("URL is required");
  }

  let response: Response;
  try {
    response = await fetch(url, { method: "HEAD" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to fetch headers: ${err.message}`);
    }
    throw new Error("Failed to fetch headers: An unknown error occurred");
  }

  const allHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    allHeaders[key.toLowerCase()] = value;
  });

  const corsHeaderNames = [
    "access-control-allow-origin",
    "access-control-allow-methods",
    "access-control-allow-headers",
    "access-control-expose-headers",
    "access-control-allow-credentials",
    "access-control-max-age",
    "timing-allow-origin"
  ];

  const cspHeaderNames = [
    "content-security-policy",
    "content-security-policy-report-only",
  ];

  const xFrameOptionsHeaderName = "x-frame-options";

  const corsHeaders: Record<string, string> = {};
  for (const name of corsHeaderNames) {
    if (allHeaders[name]) {
      corsHeaders[name] = allHeaders[name];
    }
  }

  const cspHeaders: Record<string, string> = {};
  for (const name of cspHeaderNames) {
    if (allHeaders[name]) {
      cspHeaders[name] = allHeaders[name];
    }
  }

  const xFrameOptionsHeaders: Record<string, string> = {};
  if (allHeaders[xFrameOptionsHeaderName]) {
    xFrameOptionsHeaders[xFrameOptionsHeaderName] = allHeaders[xFrameOptionsHeaderName];
  }

  return {
    allHeaders,
    corsHeaders,
    cspHeaders,
    xFrameOptionsHeaders,
    status: {
      http_code: response.status,
      url: response.url,
    },
    originalUrl: url,
  };
});

export default function HttpHeadersTool() {
  const [url, setUrl] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["fetchHttpHeaders", url],
    queryFn: async () => {
      const response = await fetchHttpHeaders({ data: url });
      return response;
    },
    enabled: false,
    retry: 1,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (url) {
      setIsSubmitted(true);
      refetch();
    }
  };

  return (
    <ToolLayout
      title="HTTP Header Inspector"
      description="Enter a URL to inspect its HTTP headers. This tool will display all headers and highlight common security headers like CORS and CSP."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url-input">URL</Label>
          <Input
            id="url-input"
            autoFocus
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setIsSubmitted(false);
            }}
            placeholder="e.g., https://example.com"
          />
        </div>
        <Button type="submit" disabled={!url || isLoading}>
          {isLoading ? "Inspecting..." : "Inspect Headers"}
        </Button>
      </form>

      {isSubmitted && isLoading && (
        <div className="mt-6">Loading...</div>
      )}

      {isSubmitted && !isLoading && error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
          <h3 className="font-semibold">Error</h3>
          <p>{(error as Error).message}</p>
        </div>
      )}

      {isSubmitted && !isLoading && !error && data && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Headers for: <a href={data.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.originalUrl}</a></h3>
            <p className="text-sm text-muted-foreground">Status: {data.status.http_code}</p>
          </div>

          {Object.keys(data.corsHeaders).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">CORS Headers</h4>
              <div className="p-4 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700 rounded-md">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {JSON.stringify(data.corsHeaders, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {Object.keys(data.cspHeaders).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Content Security Policy (CSP) Headers</h4>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-md">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {JSON.stringify(data.cspHeaders, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {Object.keys(data.xFrameOptionsHeaders).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">X-Frame-Options</h4>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {JSON.stringify(data.xFrameOptionsHeaders, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-lg font-semibold mb-2">All Headers</h4>
             {Object.keys(data.allHeaders).length > 0 ? (
              <div className="p-4 bg-muted/50 dark:bg-muted/20 rounded-md border">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {JSON.stringify(data.allHeaders, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No headers found.</p>
            )}
          </div>

        </div>
      )}
       <div className="mt-8 space-y-3">
          <h3 className="text-sm font-medium mb-1">About this tool</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This tool directly fetches the URL you provide using a HEAD request to retrieve its HTTP headers.
              It then displays all returned headers and specifically highlights common security-related headers such as:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li><strong>CORS (Cross-Origin Resource Sharing) Headers:</strong> These headers (e.g., <code className="text-xs bg-muted p-0.5 rounded">Access-Control-Allow-Origin</code>) control how web browsers allow resources on a web page to be requested from another domain outside the domain from which the first resource was served.</li>
              <li><strong>CSP (Content Security Policy) Headers:</strong> These headers (e.g., <code className="text-xs bg-muted p-0.5 rounded">Content-Security-Policy</code>) are an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.</li>
              <li><strong>X-Frame-Options Header:</strong> This header (<code className="text-xs bg-muted p-0.5 rounded">X-Frame-Options</code>) provides clickjacking protection by indicating whether a browser should be allowed to render a page in a <code>&lt;frame&gt;</code>, <code>&lt;iframe&gt;</code>, <code>&lt;embed&gt;</code> or <code>&lt;object&gt;</code>.</li>
            </ul>
            <p>
              Understanding these headers is crucial for web developers and security analysts to ensure web applications are configured securely and function correctly across different origins.
            </p>
          </div>
        </div>
    </ToolLayout>
  );
}
