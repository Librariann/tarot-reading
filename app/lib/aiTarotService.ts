import OpenAI from 'openai';
import type { TarotReading, AITarotInterpretation } from '~/types/tarot';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateTarotReading(reading: TarotReading): Promise<AITarotInterpretation> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const cardDescriptions = reading.drawnCards.map((drawnCard, index) => {
    const card = drawnCard.card;
    const position = drawnCard.position;
    const isReversed = drawnCard.isReversed;
    
    return `${index + 1}. ${position.name} 위치: ${card.name}${isReversed ? ' (역방향)' : ''}
       - 카드 설명: ${card.description}
       - 정방향 의미: ${card.meanings.upright}
       - 역방향 의미: ${card.meanings.reversed}
       - 위치 의미: ${position.meaning}`;
  }).join('\n\n');

  const prompt = `당신은 경험이 풍부한 타로 마스터입니다. 다음 타로 리딩을 깊이 있게 해석해주세요.

질문: "${reading.question}"
스프레드: ${reading.spread.name}
스프레드 설명: ${reading.spread.description}

뽑힌 카드들:
${cardDescriptions}

다음 형식으로 한국어로 응답해주세요:

전체적인 메시지: (질문에 대한 전반적인 답변과 통찰, 3-4문장)

개별 카드 해석:
${reading.drawnCards.map((_, index) => `${index + 1}. (카드 이름과 위치에 따른 구체적인 해석, 2-3문장)`).join('\n')}

조언: (질문자에게 주는 실용적인 조언과 지침, 3-4문장)

핵심 메시지: (가장 중요한 메시지 한 문장)

각 해석은 카드의 상징적 의미와 질문의 맥락을 모두 고려하여 개인적이고 의미 있는 통찰을 제공해주세요.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 깊은 통찰력을 가진 전문 타로 리더입니다. 카드의 상징적 의미와 질문자의 상황을 종합하여 의미 있고 개인적인 해석을 제공합니다."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('AI 응답을 받지 못했습니다');
    }

    // Parse the AI response into structured format
    const sections = response.split('\n\n');
    
    // Extract overall reading
    const overallMatch = response.match(/전체적인 메시지:\s*(.*?)(?=\n\n개별 카드 해석:|$)/s);
    const overallReading = overallMatch ? overallMatch[1].trim() : sections[0] || "타로 카드가 당신의 질문에 대한 깊은 통찰을 제공합니다.";

    // Extract advice
    const adviceMatch = response.match(/조언:\s*(.*?)(?=\n\n핵심 메시지:|$)/s);
    const advice = adviceMatch ? adviceMatch[1].trim() : "카드의 메시지를 마음에 새기고 긍정적인 마음으로 나아가세요.";

    // Extract summary
    const summaryMatch = response.match(/핵심 메시지:\s*(.*?)$/s);
    const summary = summaryMatch ? summaryMatch[1].trim() : "모든 답은 이미 당신 안에 있습니다.";

    // Create card interpretations
    const cardInterpretations = reading.drawnCards.map((drawnCard, index) => {
      const cardRegex = new RegExp(`${index + 1}\\.\\s*(.*?)(?=\\n\\d+\\.|$)`, 's');
      const cardMatch = response.match(cardRegex);
      const interpretation = cardMatch ? cardMatch[1].trim() : 
        `${drawnCard.card.name}이 ${drawnCard.position.name} 위치에서 ${drawnCard.isReversed ? '역방향으로 ' : ''}나타나 당신에게 중요한 메시지를 전달합니다.`;

      return {
        cardName: drawnCard.card.name,
        position: drawnCard.position.name,
        isReversed: drawnCard.isReversed,
        interpretation,
        significance: drawnCard.position.meaning
      };
    });

    return {
      overallReading,
      cardInterpretations,
      advice,
      summary
    };

  } catch (error) {
    console.error('AI 타로 해석 생성 오류:', error);
    throw new Error('AI 타로 해석을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }
}