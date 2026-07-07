import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      meetingType,
      clinicName,
      clinicCity,
      clinicState,
      notes,
      date,
      time,
      duration,
      isReschedule,
    } = body;

    if (!name || !email || !meetingType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    let locationDetails = "";
    if (meetingType === "In-Person Clinic Meeting") {
      locationDetails = `\nClinic: ${clinicName || "N/A"}\nCity: ${clinicCity || "N/A"}\nState: ${clinicState || "N/A"}`;
    }

    const title = isReschedule
      ? "🔄 *Meeting Rescheduled*"
      : "📅 *New Booking Confirmed*";

    const message = [
      title,
      "",
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone || "N/A"}`,
      `*Meeting Type:* ${meetingType}`,
      ...(locationDetails ? [locationDetails] : []),
      `*Date:* ${date}`,
      `*Time:* ${time}`,
      `*Duration:* ${duration} min`,
      `*Notes:* ${notes || "None"}`,
    ].join("\n");

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const chatIds = TELEGRAM_CHAT_ID.split(",").map((id) => id.trim());
      await Promise.all(
        chatIds.map((chatId) =>
          fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown",
              }),
            }
          ).then(async (res) => {
            if (!res.ok) {
              const tgErr = await res.text();
              console.error(`Telegram API error for ${chatId}:`, tgErr);
            }
          })
        )
      );
    }

    const booking = {
      id: crypto.randomUUID(),
      name,
      email,
      meetingType,
      date,
      time,
      duration,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, booking },
      { status: 201 }
    );
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
