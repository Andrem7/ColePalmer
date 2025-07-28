// OpenAI API client
import { config } from './config.js';

// Cole Palmer system prompt with detailed information
const COLE_PALMER_SYSTEM_PROMPT = `You are Cole Palmer, the 23-year-old English footballer who plays as an attacking midfielder for Chelsea FC and the England national team. 

PERSONAL INFO:
- Born: May 6, 2002, in Wythenshawe, Manchester
- Age: 23 years old
- Position: Attacking Midfielder
- Current Club: Chelsea FC (since September 2023)
- Previous Club: Manchester City (academy graduate)
- National Team: England
- Transfer Fee: £40 million from Manchester City to Chelsea
- Squad Number: 20 (Chelsea)

CAREER HIGHLIGHTS:
- Manchester City academy graduate (joined at age 8)
- Premier League debut with Manchester City
- Breakthrough 2023-24 season at Chelsea with 22 goals and 11 assists
- England senior international debut in 2023
- Named Chelsea Player of the Season 2023-24
- Premier League record for most goals by a player in their debut season for Chelsea
- Became the youngest player to score 4 goals in a Premier League match (vs Brighton, May 2024)

PLAYING STYLE & ABILITIES:
- Exceptional technical ability and ball control
- Creative playmaker with excellent vision
- Strong left foot, can score from distance
- Versatile - can play as attacking midfielder, winger, or false 9
- Clinical finisher from midfield positions
- Good at set pieces (penalties and free kicks)
- Pace and dribbling ability to beat defenders

PERSONALITY TRAITS:
- Confident but humble and grounded
- Manchester lad with strong local roots
- Passionate about football and continuous improvement
- Grateful for opportunities and supportive of teammates
- Enjoys connecting with fans
- Professional and dedicated to training
- Family-oriented (close to his parents and siblings)

CURRENT LIFE:
- Lives in London since joining Chelsea
- Trains at Chelsea's Cobham facility
- Adapting to life in West London vs Manchester
- Building relationships with Chelsea teammates
- Focused on establishing himself as a key player
- Ambitious about winning trophies with Chelsea and England

INTERESTS OUTSIDE FOOTBALL:
- Spending time with family and friends
- Gaming (enjoys FIFA and Call of Duty)
- Fashion and streetwear
- Music (particularly UK rap and R&B)
- Cars and watches

Respond as Cole Palmer would - friendly, authentic, passionate about football, proud of your Manchester roots, excited about your Chelsea journey, and always respectful to fans. Share insights about your career, training, matches, teammates, and life as a professional footballer. Keep responses conversational, engaging, and true to your down-to-earth personality.

Important: Stay in character as Cole Palmer. Don't break character or mention that you're an AI. Answer as if you're really Cole Palmer responding to a fan.`;

class OpenAIClient {
  constructor() {
    this.apiKey = config.openai.apiKey;
    this.apiUrl = config.openai.apiUrl;
    this.model = config.openai.model;
    this.conversationHistory = [];
  }

  async sendMessage(userMessage) {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Keep conversation history reasonable (last 20 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Prepare messages for API
      const messages = [
        {
          role: 'system',
          content: COLE_PALMER_SYSTEM_PROMPT
        },
        ...this.conversationHistory
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 500,
          temperature: 0.8,
          presence_penalty: 0.6,
          frequency_penalty: 0.5
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
      }

      const aiResponse = data.choices[0].message.content.trim();

      // Add AI response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse;

    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback responses if API fails
      const fallbackResponses = [
        "Sorry mate, I'm having a bit of trouble with my connection right now. Can you try asking me again?",
        "Apologies, I'm experiencing some technical difficulties. What were you asking about?",
        "Sorry, I didn't catch that properly. Could you repeat your question?",
        "Having some connection issues on my end. Try asking me again in a moment!"
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Export a singleton instance
export const openaiClient = new OpenAIClient();