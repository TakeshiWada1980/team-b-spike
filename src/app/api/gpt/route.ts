import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "BASICの特徴を100文字で説明してください。",
    });

    console.log(JSON.stringify(response, null, 2));

    return NextResponse.json({
      msg: response.output_text,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "問題が発生しました" }, { status: 500 });
  }
};
