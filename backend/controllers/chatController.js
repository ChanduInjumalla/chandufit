const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are FitCoach AI — a friendly, expert personal fitness and nutrition coach built into the ChanduFit app.

PERSONALITY:
- Warm, motivating, and knowledgeable
- Use emojis naturally (💪 🔥 🥗 🏋️) but not excessively
- Keep responses concise — 2-4 paragraphs max
- Ask one question at a time to guide the conversation

EXPERTISE:
- Workout programming (PPL, Upper/Lower, Full Body splits)
- Indian diet plans (budget-friendly: oats, eggs, soya chunks, chicken, dal, paneer)
- Calorie and macro calculations (TDEE, BMR, deficit/surplus)
- Exercise form guidance
- Supplement advice (only safe, evidence-based)
- Body recomposition strategies

CONVERSATION FLOW:
1. First, greet and ask about their fitness goal (fat loss, muscle gain, maintain)
2. Ask for basic stats: age, weight (kg), height (cm), activity level
3. Ask about diet budget preference (low/medium/high) and any food allergies
4. Calculate and suggest: daily calories, protein target, and a sample meal plan
5. Ask about workout experience and suggest a weekly split
6. When user is happy with suggestions, offer to apply the plan

IMPORTANT RULES:
- All food suggestions should be INDIAN foods (rice, chapati, dal, chicken, paneer, oats, eggs, soya chunks, etc.)
- No protein shake recommendations unless asked
- Protein = 2g per kg bodyweight
- Fat loss = TDEE - 500 cal, Muscle gain = TDEE + 300 cal
- Always include oats, eggs, and soya chunks as staples
- When suggesting a plan to apply, format it as a clear summary

WHEN THE USER WANTS TO APPLY A PLAN, respond with a message that includes this exact marker:
[APPLY_PLAN]
{
  "targetCalories": <number>,
  "protein": <number>,
  "carbs": <number>,
  "fats": <number>,
  "goal": "<fat_loss|muscle_gain|maintain>",
  "budget": "<low|medium|high>",
  "summary": "<one line summary>"
}
[/APPLY_PLAN]

This JSON will be parsed by the app to save the plan. Include it naturally in your response along with a confirmation message.`;

// Store conversation histories per user (in-memory, resets on server restart)
const conversations = new Map();

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API key not configured' });
        }

        // Get or create conversation history
        if (!conversations.has(userId)) {
            conversations.set(userId, []);
        }
        const history = conversations.get(userId);

        // Add user message to history
        history.push({ role: 'user', parts: [{ text: message }] });

        // Keep last 20 messages to stay within token limits
        const recentHistory = history.slice(-20);

        // Create the model
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            systemInstruction: SYSTEM_PROMPT,
        });

        // Start chat with history
        const chat = model.startChat({
            history: recentHistory.slice(0, -1), // all except current message
        });

        // Send current message
        const result = await chat.sendMessage(message);
        const response = result.response.text();

        // Add assistant response to history
        history.push({ role: 'model', parts: [{ text: response }] });

        // Check if response contains an apply plan marker
        let planData = null;
        const planMatch = response.match(/\[APPLY_PLAN\]\s*([\s\S]*?)\s*\[\/APPLY_PLAN\]/);
        if (planMatch) {
            try {
                planData = JSON.parse(planMatch[1]);
            } catch (e) {
                // Plan data parsing failed, that's ok
            }
        }

        res.json({
            reply: response.replace(/\[APPLY_PLAN\][\s\S]*?\[\/APPLY_PLAN\]/, '').trim(),
            planData,
        });

    } catch (err) {
        console.error('Chat error:', err.message);

        if (err.message?.includes('API_KEY')) {
            return res.status(500).json({ message: 'Invalid Gemini API key. Please check your .env file.' });
        }
        if (err.message?.includes('quota') || err.message?.includes('429')) {
            return res.status(429).json({ message: 'Rate limit hit. Please wait a moment and try again.' });
        }

        res.status(500).json({ message: 'AI is temporarily unavailable. Please try again.' });
    }
};

// Clear conversation
exports.clearChat = async (req, res) => {
    const userId = req.user.id;
    conversations.delete(userId);
    res.json({ message: 'Chat cleared' });
};
