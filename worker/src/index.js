const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://ghrezaei1399-code.github.io",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
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
      const body = await request.json();

      const messages = Array.isArray(body.messages)
        ? body.messages
        : [];

      if (!messages.length) {
        return new Response(
          JSON.stringify({ error: "پیام خالی است." }),
          {
            status: 400,
            headers: {
              ...cors,
              "Content-Type": "application/json"
            }
          }
        );
      }

      if (!env.OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({
            error: "OPENAI_API_KEY در Worker تنظیم نشده است."
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

      const response = await fetch(OPENAI_URL, {
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

      const data = await response.json();

      return new Response(
        JSON.stringify(data),
        {
          status: response.status,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "خطا در ارتباط با سرویس هوش مصنوعی."
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
