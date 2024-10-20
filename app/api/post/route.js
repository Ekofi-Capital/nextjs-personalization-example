// app/api/spinosis/post/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id, parameter } = await req.json(); // Extract user_id, auth_token, and parameter from request body

    if (!user_id || !parameter) {
      throw new Error("Missing user_id or parameter");
    }

    const response = await fetch("https://app.spinosis.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SPINOSIS_SECRET_KEY}`,
      },
      body: JSON.stringify({
        click: parameter,
        user_id: user_id,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
