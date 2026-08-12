const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export default {
  async fetch(request, env) {

    const origin = request.headers.get("Origin") || "";

    const allowedOrigins = [
      "https://ghrezaei1399-code.github.io",
      "http://localhost:3000",
      "http://localhost:5173"
    ];

    const allowOrigin = allowedOrigins.includes(origin)
      ? origin
      : "https://ghrezaei1399-code.github.io";

    const cors = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method Not Allowed"
        }),
        {
          status: 405,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {
      if (!env.OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({
            error: "OPENAI_API_KEY تنظیم نشده است."
          }),
          {
            status: 500,
            headers: {
              ...cors,
              "Content-Type": "application/json"
            }
          }
        );
      }

      const body = await request.json();

      const messages = Array.isArray(body.messages)
        ? body.messages
        : [];

      if (!messages.length) {
        return new Response(
          JSON.stringify({
            error: "پیام خالی است."
          }),
          {
            status: 400,
            headers: {
              ...cors,
              "Content-Type": "application/json"
            }
          }
        );
      }

      const openaiResponse = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.5,
          max_tokens: 700
        })
      });

      const data = await openaiResponse.json();

      return new Response(
        JSON.stringify(data),
        {
          status: openaiResponse.status,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error?.message || "خطا در ارتباط با سرویس هوش مصنوعی."
        }),
        {
          status: 500,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
