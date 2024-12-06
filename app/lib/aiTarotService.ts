import type { TarotReading, AITarotInterpretation } from "~/types/tarot";

// Server-side only: Dynamic import to prevent client-side execution
let openai: any = null;

export async function generateTarotReading(
  reading: TarotReading
): Promise<AITarotInterpretation> {
  // Check if we're on the server
  if (typeof window !== "undefined") {
    throw new Error("AI service can only run on the server");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  // Dynamic import to prevent client-side bundling
  if (!openai) {
    const OpenAI = (await import("openai")).default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  const cardDescriptions = reading.drawnCards
    .map((drawnCard, index) => {
      const card = drawnCard.card;
      const position = drawnCard.position;
      const isReversed = drawnCard.isReversed;

      return `${index + 1}. ${position.nameKo} 위치: ${card.nameKo}${isReversed ? " (역방향)" : ""}
       - 정방향 의미: ${card.meaningKo.upright}
       - 역방향 의미: ${card.meaningKo.reversed}
       - 위치 의미: ${position.descriptionKo}`;
    })
    .join("\n\n");

  // 오라클 스프레드인지 확인 (카드가 1장인 경우)
  const isOracleSpread = reading.drawnCards.length === 1;

  const prompt = `당신은 경험이 풍부한 타로 마스터입니다. 다음 오늘 뭐 뽑지?을 깊이 있게 해석해주세요.

  질문: "${reading.question}"
  스프레드: ${reading.spread.name}
  스프레드 설명: ${reading.spread.description}

  뽑힌 카드들:
  ${cardDescriptions}

  다음 형식으로 한국어로 응답해주세요:

  전체적인 메시지: (질문에 대한 전반적인 답변과 통찰, 3-4문장)

  ${
    isOracleSpread
      ? "카드 해석: (이 카드의 구체적인 해석 내용만, 카드명이나 위치명은 언급하지 말고 해석 내용만 3-4문장으로)"
      : `개별 카드 해석:
  ${reading.drawnCards.map((_, index) => `${index + 1}. (해당 카드의 구체적인 해석 내용만, 카드명이나 위치명은 언급하지 말고 해석 내용만 2-3문장으로)`).join("\n")}`
  }

  조언: (질문자에게 주는 실용적인 조언과 지침, 3-4문장)

  핵심 메시지: (가장 중요한 메시지 한 문장)

  각 해석은 카드의 상징적 의미와 질문의 맥락을 모두 고려하여 개인적이고 의미 있는 통찰을 제공해주세요.

  더 명료한 답변을 해주세요

  긍정적인 메시지만 제공하지말고 타로를 보고 정확하게 해석해주세요

  말투가 영적인 느낌이나 내면의 두려움 저항 이런 와닿지 않는 말투는 지양해주세요
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "당신은 깊은 통찰력을 가진 전문 타로 리더입니다. 카드의 상징적 의미와 질문자의 상황을 종합하여 의미 있고 개인적인 해석을 제공합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("AI 응답을 받지 못했습니다");
    }

    // Parse the AI response into structured format
    const sections = response.split("\n\n");

    // Extract overall reading - 오라클 스프레드와 멀티 카드 스프레드를 구분하여 처리
    let overallMatch;
    if (isOracleSpread) {
      overallMatch = response.match(
        /전체적인 메시지:\s*(.*?)(?=(?:\n\n카드 해석:|\n카드 해석:|카드 해석:|조언:|핵심 메시지:|$))/s
      );
    } else {
      overallMatch = response.match(
        /전체적인 메시지:\s*(.*?)(?=(?:\n\n개별 카드 해석:|\n개별 카드 해석:|개별 카드 해석:|조언:|핵심 메시지:|$))/s
      );
    }
    const overallReading = overallMatch
      ? overallMatch[1].trim()
      : "타로 카드가 당신의 질문에 대한 깊은 통찰을 제공합니다.";

    // Extract advice
    const adviceMatch = response.match(
      /조언:\s*(.*?)(?=(?:\n\n핵심 메시지:|\n핵심 메시지:|핵심 메시지:|$))/s
    );
    const advice = adviceMatch
      ? adviceMatch[1].trim()
      : "카드의 메시지를 마음에 새기고 긍정적인 마음으로 나아가세요.";

    // Extract summary
    const summaryMatch = response.match(/핵심 메시지:\s*(.*?)(?=\n|$)/s);
    const summary = summaryMatch
      ? summaryMatch[1].trim()
      : "모든 답은 이미 당신 안에 있습니다.";

    // Create card interpretations
    const cardInterpretations = reading.drawnCards.map((drawnCard, index) => {
      let interpretation = "";

      if (isOracleSpread) {
        // 오라클 스프레드: "카드 해석:" 섹션 찾기
        const oracleMatch = response.match(
          /카드 해석:\s*(.*?)(?=(?:\n\n조언:|\n조언:|조언:|\n\n핵심 메시지:|\n핵심 메시지:|핵심 메시지:|$))/s
        );
        interpretation = oracleMatch
          ? oracleMatch[1].trim()
          : `${drawnCard.card.nameKo}이 ${drawnCard.position.nameKo} 위치에서 ${drawnCard.isReversed ? "역방향으로 " : ""}나타나 당신에게 중요한 메시지를 전달합니다.`;
      } else {
        // 멀티 카드 스프레드: 기존 로직 사용
        let cardRegex = new RegExp(
          `${index + 1}\\.\\s*(.*?)(?=(?:조언:|핵심 메시지:|\\n\\d+\\.|$))`,
          "s"
        );
        let cardMatch = response.match(cardRegex);

        // 숫자 형식이 없다면 다른 패턴들을 시도
        if (!cardMatch) {
          const dashPatterns = response.split(/\n\s*-\s+/);
          if (dashPatterns.length > index + 1) {
            cardMatch = [
              null,
              dashPatterns[index + 1].split(/(?:조언:|핵심 메시지:)/)[0],
            ];
          }
        }

        // 여전히 없다면 줄바꿈으로 분리해서 순서대로 매칭
        if (!cardMatch) {
          const lines = response
            .split("\n")
            .filter(
              (line) =>
                line.trim() &&
                !line.includes("전체적인 메시지:") &&
                !line.includes("개별 카드 해석:") &&
                !line.includes("조언:") &&
                !line.includes("핵심 메시지:")
            );

          let interpretationSection = false;
          let interpretationLines = [];

          for (const line of lines) {
            if (line.includes("개별 카드 해석:")) {
              interpretationSection = true;
              continue;
            }
            if (line.includes("조언:") || line.includes("핵심 메시지:")) {
              interpretationSection = false;
              break;
            }
            if (interpretationSection && line.trim()) {
              interpretationLines.push(line.trim());
            }
          }

          if (interpretationLines[index]) {
            cardMatch = [null, interpretationLines[index]];
          }
        }

        interpretation =
          cardMatch && cardMatch[1]
            ? cardMatch[1].trim()
            : `${drawnCard.card.nameKo}이 ${drawnCard.position.nameKo} 위치에서 ${drawnCard.isReversed ? "역방향으로 " : ""}나타나 당신에게 중요한 메시지를 전달합니다.`;
      }

      return {
        cardName: drawnCard.card.nameKo,
        position: drawnCard.position.nameKo,
        isReversed: drawnCard.isReversed,
        interpretation,
        significance: drawnCard.position.descriptionKo,
      };
    });

    return {
      overallReading,
      cardInterpretations,
      advice,
      summary,
    };
  } catch (error) {
    console.error("AI 타로 해석 생성 오류:", error);
    throw new Error(
      "AI 타로 해석을 생성할 수 없습니다. 잠시 후 다시 시도해주세요."
    );
  }
}
