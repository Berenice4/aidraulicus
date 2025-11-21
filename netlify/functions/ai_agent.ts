
interface HandlerEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

interface HandlerResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Handle preflight OPTIONS request just in case of CORS needs
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // Retrieve the API Key from the server-side environment variables
    // This variable must be set in your Netlify Site Settings -> Environment Variables
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API_KEY environment variable is missing on the server.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error: API Key missing" }),
      };
    }

    // Return the key to the client. 
    // Note: In a production environment for high security, you might proxy the websocket connection 
    // through the backend, but for this architecture, we pass the key to the client 
    // to allow direct low-latency connection to Google's WebSocket API.
    return {
      statusCode: 200,
      body: JSON.stringify({ apiKey }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Unexpected error in ai_agent function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
