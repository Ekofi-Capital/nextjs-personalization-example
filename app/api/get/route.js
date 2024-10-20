// app/api/spinosis/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id } = await req.json(); // Extract user_id and auth_token from request body

    if (!user_id) {
      throw new Error("Missing user_id");
    }

    const response = await fetch(
      `https://app.spinosis.com/api/get?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SPINOSIS_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
