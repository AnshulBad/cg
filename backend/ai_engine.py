"""
Compliance Quest — AI Engine (Google Gemini)

Provides AI-powered features:
- Dynamic scenario generation from uploaded documents
- Adaptive difficulty based on player weak areas
- Intelligent feedback explanations for answers
- Natural NPC conversation responses
"""

import os
import uuid
import json
import logging
from typing import List, Optional
from pathlib import Path

# Load .env from backend/ directory
_env_path = Path(__file__).parent / ".env"
if _env_path.exists():
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())

logger = logging.getLogger(__name__)

# ── Gemini Client Setup ─────────────────────────────────
_model = None

def _get_model():
    """Lazy-init the Gemini model."""
    global _model
    if _model is not None:
        return _model
    try:
        import google.generativeai as genai
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            logger.warning("GEMINI_API_KEY not set; AI features will use fallbacks")
            return None
        genai.configure(api_key=api_key)
        _model = genai.GenerativeModel("gemini-flash-latest")
        logger.info("Gemini model initialized successfully with gemini-flash-latest")
        return _model
    except Exception as e:
        logger.error("Failed to initialize Gemini: %s", e)
        return None


def _ask_gemini(prompt: str, fallback: str = "") -> str:
    """Send a prompt to Gemini and return the response text."""
    model = _get_model()
    if model is None:
        return fallback
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        error_str = str(e)
        logger.error("Gemini API Error Detail: %s", error_str)
        if "429" in error_str or "quota" in error_str.lower():
            logger.warning("Gemini quota exceeded.")
            # More professional, in-character fallback for quota issues
            return "I'm currently reviewing several urgent compliance reports. Let's take a quick breather and I'll get back to you in just a moment!"
        logger.error("Gemini API error: %s", e)
        # Professional generic fallback
        return "I'm processing a lot of information right now. Could you please rephrase that or ask again shortly?"


def generate_sample_scenarios():
    """Generate sample scenarios for all three domains across 3 levels."""
    samples = []

    # ── CYBER ──────────────────────────────────────────
    cyber = [
        {
            'domain': 'cyber', 'level': 1, 'difficulty': 1, 'topic': 'removable_media',
            'title': 'The USB Mystery',
            'story': 'Walking to your desk, you notice a USB drive on the floor near the printer. It has no label.',
            'question': 'You find a USB stick on the floor. What do you do?',
            'options': ['Plug it into your workstation', 'Report to IT Security', 'Throw it away', 'Ignore it'],
            'correct_index': 1,
        },
        {
            'domain': 'cyber', 'level': 1, 'difficulty': 1, 'topic': 'phishing',
            'title': 'The Suspicious Email',
            'story': 'You receive an email from "IT Support" asking you to verify your credentials via a link.',
            'question': 'A suspicious email asks for your credentials. What is best practice?',
            'options': ['Reply with details', 'Click the link to verify', 'Report to the SOC', 'Forward to colleagues'],
            'correct_index': 2,
        },
        {
            'domain': 'cyber', 'level': 1, 'difficulty': 1, 'topic': 'password_security',
            'title': 'The Password Dilemma',
            'story': 'A colleague forgot their password before an important demo and asks to use yours temporarily.',
            'question': 'Should you share your password with a trusted colleague?',
            'options': ['Yes, it\'s only temporary', 'Never share credentials', 'Only if they sign a form', 'Ask your manager'],
            'correct_index': 1,
        },
        {
            'domain': 'cyber', 'level': 2, 'difficulty': 2, 'topic': 'social_engineering',
            'title': 'The Urgent Call',
            'story': 'Someone calls claiming to be from the IT helpdesk and urgently requests your OTP to fix a critical issue.',
            'question': 'How do you respond to an IT help desk caller asking for your OTP?',
            'options': ['Share the OTP (Be helpful)', 'Verify caller identity first', 'Report the attempt immediately', 'Hang up without responding'],
            'correct_index': 1,
        },
        {
            'domain': 'cyber', 'level': 2, 'difficulty': 2, 'topic': 'data_handling',
            'title': 'The Public WiFi',
            'story': 'You\'re at a coffee shop and need to send a confidential report. Free WiFi is available.',
            'question': 'What is the safest way to send a confidential report on public WiFi?',
            'options': ['Send it directly — it\'s urgent', 'Use the company VPN first', 'Email it from personal email', 'Wait until you\'re back at the office'],
            'correct_index': 1,
        },
        {
            'domain': 'cyber', 'level': 3, 'difficulty': 3, 'topic': 'incident_response',
            'title': 'The Ransomware Hit',
            'story': 'Files on your system are suddenly encrypted and a ransom note appears on your screen demanding Bitcoin.',
            'question': 'Your system is hit by ransomware. What\'s the FIRST thing to do?',
            'options': ['Pay the ransom quickly', 'Disconnect from the network immediately', 'Keep working on unaffected files', 'Call the press'],
            'correct_index': 1,
        },
        {
            'domain': 'cyber', 'level': 3, 'difficulty': 3, 'topic': 'data_breach',
            'title': 'The Data Leak',
            'story': 'You discover a database with customer PII has been publicly exposed due to a misconfiguration.',
            'question': 'What is the correct response to discovering an exposed customer database?',
            'options': ['Quietly patch it and move on', 'Report to CISO and legal immediately', 'Delete the database', 'Tell colleagues only'],
            'correct_index': 1,
        },
    ]

    # ── POSH ──────────────────────────────────────────
    posh = [
        {
            'domain': 'posh', 'level': 1, 'difficulty': 1, 'topic': 'harassment',
            'title': 'The Inappropriate Joke',
            'story': 'During a team lunch, a colleague shares an offensive joke about a particular gender.',
            'question': 'A colleague shares an inappropriate joke about a protected group. You should:',
            'options': ['Laugh along to not make it awkward', 'Report it to HR', 'Share more jokes to fit in', 'Ignore it and change the subject'],
            'correct_index': 1,
        },
        {
            'domain': 'posh', 'level': 1, 'difficulty': 1, 'topic': 'workplace_conduct',
            'title': 'The Uncomfortable Comment',
            'story': 'A senior colleague makes a personal comment about your appearance that makes you uncomfortable.',
            'question': 'A colleague makes an unwanted comment about your appearance. What should you do?',
            'options': ['Say nothing — they\'re senior', 'Politely but firmly tell them it\'s inappropriate', 'Complain to everyone except HR', 'Quit your job'],
            'correct_index': 1,
        },
        {
            'domain': 'posh', 'level': 2, 'difficulty': 2, 'topic': 'reporting',
            'title': 'The Witnessing',
            'story': 'You witness a colleague persistently bothering another employee who has asked them to stop.',
            'question': 'You witness a colleague persistently harassing another employee. What do you do?',
            'options': ['Mind your own business', 'Intervene and/or report to the ICC', 'Talk to the harasser only', 'Post about it on social media'],
            'correct_index': 1,
        },
        {
            'domain': 'posh', 'level': 2, 'difficulty': 2, 'topic': 'retaliation',
            'title': 'The Retaliation Fear',
            'story': 'An employee reports harassment but fears retaliation from their team lead.',
            'question': 'An employee is afraid to report harassment due to fear of retaliation. What is true?',
            'options': ['Retaliation is a natural consequence', 'POSH law prohibits retaliation against complainants', 'Only report if you have solid proof', 'Keep quiet to maintain team harmony'],
            'correct_index': 1,
        },
        {
            'domain': 'posh', 'level': 3, 'difficulty': 3, 'topic': 'icc_process',
            'title': 'The ICC Timeline',
            'story': 'A complaint has been filed with the Internal Complaints Committee.',
            'question': 'What is the maximum time the ICC has to complete its inquiry under POSH law?',
            'options': ['30 days', '90 days', '60 days', '120 days'],
            'correct_index': 2,
        },
    ]

    # ── BUSINESS CONTINUITY ────────────────────────────
    business = [
        {
            'domain': 'business', 'level': 1, 'difficulty': 1, 'topic': 'escalation',
            'title': 'The System Crash',
            'story': 'A critical business application crashes during  peak usage hours with hundreds of users affected.',
            'question': 'A critical system fails during peak hours. Who do you notify FIRST?',
            'options': ['Team Lead / Incident Manager', 'Post on social media', 'Call the client directly', 'Wait to see if it self-recovers'],
            'correct_index': 0,
        },
        {
            'domain': 'business', 'level': 1, 'difficulty': 1, 'topic': 'bcp_basics',
            'title': 'The BCP Document',
            'story': 'A natural disaster warning has been issued for your city. Your team needs to know the plan.',
            'question': 'Where should employees find the Business Continuity Plan during a disaster?',
            'options': ['Ask the CEO', 'The BCP document shared in onboarding', 'Google it', 'It doesn\'t exist'],
            'correct_index': 1,
        },
        {
            'domain': 'business', 'level': 2, 'difficulty': 2, 'topic': 'rto_rpo',
            'title': 'The Recovery Targets',
            'story': 'The IT team is discussing recovery objectives after a major system outage.',
            'question': 'What does RTO stand for in Business Continuity?',
            'options': ['Real-Time Output', 'Recovery Time Objective', 'Risk Tolerance Overview', 'Response Team Order'],
            'correct_index': 1,
        },
        {
            'domain': 'business', 'level': 2, 'difficulty': 2, 'topic': 'crisis_communication',
            'title': 'The Client Call',
            'story': 'An important client calls during an active system outage demanding status updates.',
            'question': 'What is the correct way to communicate with clients during an active outage?',
            'options': ['Say nothing until fully resolved', 'Provide honest status updates at regular intervals', 'Blame vendors publicly', 'Transfer to IT without context'],
            'correct_index': 1,
        },
        {
            'domain': 'business', 'level': 3, 'difficulty': 3, 'topic': 'drp',
            'title': 'The Disaster Drill',
            'story': 'Your organization\'s Disaster Recovery Plan has not been tested for two years.',
            'question': 'How often should a Disaster Recovery Plan be tested?',
            'options': ['Only when a disaster actually happens', 'At least annually', 'Every 5 years', 'It never needs testing'],
            'correct_index': 1,
        },
    ]
    samples = cyber + posh + business
    # Assign unique IDs to each scenario
    for s in samples:
        s['id'] = str(uuid.uuid4())
    return samples


# ── AI-Powered Response Evaluation ──────────────────────


# ── AI-Powered Response Evaluation ──────────────────────
def evaluate_player_response(scenario_story: str, scenario_question: str,
                             correct_answer: str, player_response: str,
                             options: list, domain: str,
                             npc_name: str = "Colleague",
                             conversation_history: list = None) -> dict:
    """
    Evaluate a player's free-text response to a compliance scenario.

    Returns a dict with:
      score (0-100), is_correct (bool), feedback (str),
      npc_reaction (str), follow_up (str|None)
    """
    history_text = ""
    if conversation_history:
        history_text = "\n".join(
            f"{'Player' if m['role']=='player' else npc_name}: {m['text']}"
            for m in conversation_history
        )
        history_text = f"\nConversation so far:\n{history_text}\n"

    prompt = f"""You are a sharp, intelligent compliance training evaluator at Gemini Solutions.
Your job: read the player's response carefully, understand their INTENT, and evaluate how well it addresses the compliance scenario.

SCENARIO CONTEXT:
Story: {scenario_story}
Question asked: {scenario_question}
The CORRECT action is: {correct_answer}
Other options were: {json.dumps(options)}
Domain: {domain} (cyber=cybersecurity, posh=harassment prevention, bcp=business continuity)
{history_text}
PLAYER TYPED: "{player_response}"

EVALUATION INSTRUCTIONS:
1. Read the player's exact words. What are they actually suggesting?
2. INTENT MATCH (50 pts): Does their suggestion match the spirit of the correct answer? Be generous with paraphrasing — "tell HR" and "report to human resources" mean the same thing. "I wouldn't do it" for a wrong action is correct. Award partial credit.
3. REASONING (30 pts): Did they explain WHY or show understanding? Even brief reasoning like "it's against policy" counts.
4. PROFESSIONALISM (20 pts): Is the approach respectful and workplace-appropriate?

SCORING GUIDE:
- 85-100: Player essentially described the correct action with good reasoning
- 65-84: Player has the right idea but is vague or missing reasoning
- 40-64: Partially correct or right instinct but wrong approach
- 0-39: Fundamentally wrong or dangerous suggestion

CRITICAL RULES for your response:
- In "feedback", DIRECTLY QUOTE the player's words and explain what was good/bad about their specific answer
- In "npc_reaction", respond AS {npc_name} having a natural conversation — reference what the player said, don't be generic
- In "follow_up", if the player was vague (score < 75), ask a SPECIFIC follow-up based on what they missed. 
- AVOID REPETITION: Check the `conversation_history` above carefully. If {npc_name} has ALREADY asked a follow-up or pushed back against the player in a previous turn, DO NOT ask another follow-up. Set "follow_up" to null and score exactly what the player provided in this final round.
- Keep NPC reaction warm, natural, like a friendly Indian colleague chatting at the office
- DO NOT use markdown. DO NOT use asterisks or bold formatting.

You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no ```):
{{
  "score": <number 0-100>,
  "is_correct": <true if score >= 50>,
  "feedback": "<1-2 sentences quoting the player's words and explaining the evaluation>",
  "npc_reaction": "<1-2 sentences as {npc_name} reacting naturally to the player's specific response>",
  "follow_up": "<A specific follow-up question based on what the player missed, OR null if score >= 75>"
}}"""

    fallback_score = 30
    # Improved keyword matching for fallback
    correct_lower = correct_answer.lower()
    response_lower = player_response.lower()
    keywords = [w for w in correct_lower.split() if len(w) > 3]
    matches = sum(1 for w in keywords if w in response_lower)
    if keywords:
        match_ratio = matches / len(keywords)
        if match_ratio >= 0.5:
            fallback_score = 70
        elif match_ratio >= 0.25:
            fallback_score = 55
        elif matches >= 1:
            fallback_score = 45

    fallback = json.dumps({
        "score": fallback_score,
        "is_correct": fallback_score >= 50,
        "feedback": f"The correct approach is: {correct_answer}. Your response was evaluated based on how closely it matches this action.",
        "npc_reaction": f"Hmm, interesting thought! The best approach here would be to {correct_answer.lower()}.",
        "follow_up": None if fallback_score >= 75 else f"Could you think about why '{correct_answer.lower()}' might be the right approach here?"
    })

    result_text = _ask_gemini(prompt, fallback)

    try:
        cleaned = result_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            cleaned = cleaned.rsplit("```", 1)[0]
        return json.loads(cleaned)
    except (json.JSONDecodeError, KeyError):
        logger.error("Failed to parse AI evaluation: %s", result_text[:200])
        return json.loads(fallback)


# ── AI-Powered MCQ Feedback ──────────────────────────────
def generate_ai_feedback(question: str, options: list, correct_index: int,
                         selected_index: int, domain: str) -> str:
    """Generate personalized AI feedback for an MCQ answer."""
    is_correct = (selected_index == correct_index)
    selected_text = options[selected_index] if selected_index < len(options) else "Unknown"
    correct_text = options[correct_index] if correct_index < len(options) else "Unknown"

    prompt = f"""You are a compliance training expert. 
A player just answered a compliance question in the {domain} domain.

Question: {question}
Correct Answer: {correct_text}
Player Selected: {selected_text}
Result: {"CORRECT" if is_correct else "INCORRECT"}

Provide a concise, 1-2 sentence explanation of why the correct answer is right and (if they were wrong) why their choice was suboptimal. 
Be encouraging and professional. Do NOT use markdown or bold text."""

    fallback = f"The correct answer is '{correct_text}'. " + \
               ("Well done!" if is_correct else "Make sure to review company policy on this topic.")
    
    return _ask_gemini(prompt, fallback)


# ── AI-Powered NPC Conversation ─────────────────────────
def generate_npc_conversation(npc_name: str, player_name: str,
                              player_message: str,
                              scenario_context: str = "",
                              conversation_history: list = None,
                              player_stats: dict = None) -> str:
    """Generate a contextual NPC reply during a multi-turn conversation."""
    history_text = ""
    if conversation_history:
        history_text = "\nConversation history:\n" + "\n".join(
            f"{'Player' if m['role']=='player' else npc_name}: {m['text']}"
            for m in conversation_history[-6:]  # Last 6 messages max
        )

    stats_hint = ""
    if player_stats:
        acc = player_stats.get("accuracy", 50)
        if acc > 80:
            stats_hint = f"\n(Note: {player_name} is performing very well, so be more challenging and add nuance.)"
        elif acc < 40:
            stats_hint = f"\n(Note: {player_name} is struggling. Be encouraging and give gentle hints.)"

    prompt = f"""You are {npc_name}, an office colleague at Gemini Solutions in India.
You are having a conversation with {player_name}.

Context: {scenario_context if scenario_context else "Casual office interaction."}
{history_text}
{stats_hint}
{player_name} just said: "{player_message}"

Reply naturally in 1-2 short sentences as a friendly Indian office colleague.
Be warm, natural, and brief. Do NOT use markdown. Stay in character."""

    fallbacks = [
        f"That's a good point, {player_name}!",
        "Hmm, I see what you mean.",
        f"Interesting, {player_name}. Let me think about that.",
        "Yeah, that makes sense actually!"
    ]
    import random
    return _ask_gemini(prompt, random.choice(fallbacks))


# ── AI-Powered Scenario Generation from Documents ──────
def parse_document_and_generate_scenarios(text: str,
                                          domain: str = "cyber") -> List[dict]:
    """Parse an uploaded document and generate compliance scenarios using AI."""
    prompt = f"""You are a compliance training expert. Given the following policy document,
generate exactly 5 compliance training scenarios as a JSON array.

Document:
{text[:3000]}

Each scenario must have this exact JSON structure:
{{
  "id": "unique_string",
  "domain": "{domain}",
  "level": 1,
  "title": "Short Title",
  "story": "A 2-3 sentence story describing a workplace situation in an Indian office",
  "question": "What should you do?",
  "options": ["Option A", "Option B", "Option C"],
  "correct_index": 0,
  "topic": "topic_tag",
  "difficulty": 1,
  "consequence_correct": "What happens if you choose correctly",
  "consequence_wrong": "What happens if you choose incorrectly"
}}

Return ONLY the JSON array, no markdown formatting, no code blocks."""

    # Try AI generation
    result = _ask_gemini(prompt, "")
    if result:
        try:
            # Clean up potential markdown formatting
            cleaned = result.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1]
                cleaned = cleaned.rsplit("```", 1)[0]
            scenarios = json.loads(cleaned)
            if isinstance(scenarios, list):
                # Ensure IDs are unique
                for s in scenarios:
                    s['id'] = str(uuid.uuid4())
                    s['domain'] = domain
                logger.info("AI generated %d scenarios from document", len(scenarios))
                return scenarios
        except (json.JSONDecodeError, KeyError) as e:
            logger.error("Failed to parse AI-generated scenarios: %s", e)

    # Fallback: Generate basic scenarios from text
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    out = []
    for i, l in enumerate(lines[:10]):
        out.append({
            'id': str(uuid.uuid4()),
            'domain': 'cyber',
            'level': 1,
            'title': f'Scenario {i+1}',
            'story': l[:200],
            'question': f'Based on the following situation: "{l[:80]}..." — what is the correct action?',
            'options': ['Take no action', 'Report to your manager', 'Follow company policy', 'Escalate to the appropriate team'],
            'correct_index': 2,
            'topic': 'generated',
            'difficulty': 1,
        })
    return out


# ── Adaptive Difficulty ─────────────────────────────────
def get_adaptive_recommendation(user_stats: dict, domain: str) -> dict:
    """Analyze player stats and recommend difficulty adjustments."""
    total = user_stats.get("total", 0)
    correct = user_stats.get("correct", 0)
    weak_topics = user_stats.get("weak_topics", {})

    if total == 0:
        return {"difficulty": "normal", "focus_topics": [], "message": ""}

    accuracy = correct / total if total else 0

    if accuracy < 0.4:
        difficulty = "easier"
        message = "Let's review some fundamentals to build your confidence."
    elif accuracy > 0.8:
        difficulty = "harder"
        message = "Great performance! Let's increase the challenge."
    else:
        difficulty = "normal"
        message = ""

    focus = sorted(weak_topics.items(), key=lambda x: x[1], reverse=True)[:3]
    focus_topics = [t[0] for t in focus]

    return {
        "difficulty": difficulty,
        "focus_topics": focus_topics,
        "message": message
    }
