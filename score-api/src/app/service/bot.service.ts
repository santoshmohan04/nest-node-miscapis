import { Injectable } from '@nestjs/common';
import { BotResponseDto } from '../dto/bot.dto';

@Injectable()
export class BotService {
  detectIntent(text: string): BotResponseDto {
    const lowerText = text.toLowerCase();

    // Weather detection
    if (lowerText.includes('weather') || lowerText.includes('temperature') ||
        lowerText.includes('forecast') || lowerText.includes('rain') ||
        lowerText.includes('sunny') || lowerText.includes('cloudy')) {
      return {
        intent: 'weather',
        response: `I detected you're asking about weather. The current weather in your area is sunny with a temperature of 72°F.`,
        data: {
          temperature: 72,
          condition: 'sunny',
          location: 'your area'
        }
      };
    }

    // Currency detection
    if (lowerText.includes('currency') || lowerText.includes('exchange') ||
        lowerText.includes('dollar') || lowerText.includes('euro') ||
        lowerText.includes('convert') || lowerText.includes('rate')) {
      return {
        intent: 'currency',
        response: `I detected you're asking about currency exchange. 1 USD = 0.85 EUR (current rate).`,
        data: {
          from: 'USD',
          to: 'EUR',
          rate: 0.85,
          amount: 1
        }
      };
    }

    // Joke detection
    if (lowerText.includes('joke') || lowerText.includes('funny') ||
        lowerText.includes('laugh') || lowerText.includes('humor')) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you call fake spaghetti? An impasta!"
      ];
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

      return {
        intent: 'joke',
        response: randomJoke,
        data: {
          joke: randomJoke
        }
      };
    }

    // Unknown intent
    return {
      intent: 'unknown',
      response: "I'm not sure what you're asking about. I can help with weather, currency exchange rates, or tell you a joke!",
      data: null
    };
  }
}