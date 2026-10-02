import { Router } from "express";

const router = Router();

router.post("/polish-bio", async (req, res) => {
    const { bio } = req.body;

    if (!bio || !bio.trim()) {
        return res.status(400).json({ message: "Bio is required to polish" });
    }

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Groq API key is not configured" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert profile enhancer. Rewrite and polish the provided professional bio to be concise, engaging, and professional. Return ONLY the polished bio text itself, without any introductory phrases, markdown formatting, explanations, quotation marks, or multiple options."
                    },
                    {
                        role: "user",
                        content: bio.trim()
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.error?.message || "Failed to polish bio with Groq AI"
            });
        }

        const polishedBio = data.choices?.[0]?.message?.content?.trim() || bio;
        return res.status(200).json({ polishedBio });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

router.post("/summarize-chat", async (req, res) => {
    const { teamName, messages, isFallback } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "No messages provided to summarize" });
    }

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Groq API key is not configured" });
        }

        const chatTranscript = messages
            .map((m) => `[${m.time || ""}] ${m.sender}: ${m.text}`)
            .join("\n");

        const periodDescription = isFallback ? "recent activity" : "today's activity";

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: `You are an intelligent team assistant. Summarize the team's chat transcript for team "${teamName || "Team"}".
Structure the response clearly using these sections:
Overview
A 1-2 sentence high-level summary of the discussions.

Key Discussions & Decisions
- Bullet points detailing topics discussed, questions raised, and decisions reached.

Action Items
- Clear next steps or tasks assigned/mentioned (or write "None mentioned" if no tasks were discussed).

Keep the summary clear, professional, concise, and easy to read. Do not make the point title bold keep as a plain text.`
                    },
                    {
                        role: "user",
                        content: `Here is the chat transcript for ${periodDescription}:\n\n${chatTranscript}`
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.error?.message || "Failed to generate summary with Groq AI"
            });
        }

        const summary = data.choices?.[0]?.message?.content?.trim() || "No summary could be generated.";
        return res.status(200).json({ summary });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

router.post("/summarize-profile", async (req, res) => {
    const { name, currentPost, bio, skills, education, pastWork } = req.body;

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Groq API key is not configured" });
        }

        const details = [
            `Name: ${name || "Unknown"}`,
            currentPost ? `Current Position/Profession: ${currentPost}` : null,
            bio ? `Bio: ${bio}` : null,
            skills && skills.length > 0 ? `Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}` : null,
            education && education.length > 0
                ? `Education: ${education.map((e) => `${e.degree || ""} in ${e.fieldOfStudy || ""} from ${e.school || ""}`).join("; ")}`
                : null,
            pastWork && pastWork.length > 0
                ? `Work Experience: ${pastWork.map((w) => `${w.position || ""} at ${w.company || ""} (${w.years || ""} years)`).join("; ")}`
                : null
        ].filter(Boolean).join("\n");

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: `You are an executive talent analyst. Provide a concise, engaging professional brief about this person based on their profile details.
Structure the summary clearly using these plain text headings (do not make section titles bold, keep as plain text):

Professional Overview
A 2-3 sentence engaging snapshot of who they are, their role/focus, and strengths.

Key Highlights & Skills
- Bullet points summarizing their core competencies, technical skills, and strengths.

Background & Experience
- Bullet points summarizing their educational background and work history.

Keep it clear, professional, concise, and easy to read. Do not make the point title bold keep as a plain text.`
                    },
                    {
                        role: "user",
                        content: `Here are the candidate's profile details:\n\n${details}`
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.error?.message || "Failed to generate brief with Groq AI"
            });
        }

        const summary = data.choices?.[0]?.message?.content?.trim() || "No brief could be generated.";
        return res.status(200).json({ summary });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

router.post("/summarize-post", async (req, res) => {
    const { description, postContent } = req.body;
    const text = description || postContent;

    if (!text || !text.trim()) {
        return res.status(400).json({ message: "Post description is required to summarize" });
    }

    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Groq API key is not configured" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant that provides concise, crisp summaries of posts and announcements.
Summarize the key message, context, and important takeaways of the post in 2-4 lines.
Keep all headings or section titles as plain text (do NOT make point titles or section names bold).
Do not include any conversational preamble or markdown bold asterisks.`
                    },
                    {
                        role: "user",
                        content: `Summarize the following post description:\n\n${text.trim()}`
                    }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                message: data.error?.message || "Failed to summarize post with Groq AI"
            });
        }

        const summary = data.choices?.[0]?.message?.content?.trim() || "No summary could be generated.";
        return res.status(200).json({ summary });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

export default router;

