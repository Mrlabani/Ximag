import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "⚠️ Use POST request" });
    }

    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) return res.status(400).json({ success: false, error: "⚠️ No file uploaded" });

    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    const tgBotToken = "7565594863:AAF2uTPZOdMA4__i8fvZbksCjgdp4XQ0_xU";
    const chatId = "@noob_imgHost";

    const tgForm = new FormData();
    tgForm.append("chat_id", chatId);
    tgForm.append("photo", blob, file.name);

    const tgResponse = await fetch(`https://api.telegram.org/bot${tgBotToken}/sendPhoto`, {
        method: "POST",
        body: tgForm
    });

    const tgResult = await tgResponse.json();
    if (!tgResult.ok) {
        return res.status(500).json({ success: false, error: "🚨 Telegram upload failed" });
    }

    const fileId = tgResult.result.photo.pop().file_id;
    const filePathRes = await fetch(`https://api.telegram.org/bot${tgBotToken}/getFile?file_id=${fileId}`);
    const filePathData = await filePathRes.json();
    const imageUrl = `https://api.telegram.org/file/bot${tgBotToken}/${filePathData.result.file_path}`;

    return res.json({ success: true, url: imageUrl });
}
