import { useState } from "react";
import { TarotSpread } from "./types/tarot";
import { useTarotReading } from "./hooks/useTarotReading";
import { QuestionInput } from "./components/QuestionInput";
import { SpreadSelection } from "./components/SpreadSelection";
import { CardDrawing } from "./components/CardDrawing";
import { TarotReading } from "./components/TarotReading";

type AppStep =
  | "question"
  | "spread-selection"
  | "card-drawing"
  | "reading-result";

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>("question");
  const [question, setQuestion] = useState<string>("");
  const [selectedSpread, setSelectedSpread] = useState<TarotSpread | null>(
    null
  );

  const { currentReading, isDrawing, drawCards, clearReading } =
    useTarotReading();

  const handleQuestionSubmit = (submittedQuestion: string) => {
    setQuestion(submittedQuestion);
    setCurrentStep("spread-selection");
  };

  const handleSpreadSelect = (spread: TarotSpread) => {
    setSelectedSpread(spread);
    setCurrentStep("card-drawing");
  };

  const handleDrawCards = async () => {
    if (selectedSpread && question) {
      await drawCards(question, selectedSpread);
      setCurrentStep("reading-result");
    }
  };

  const handleNewReading = () => {
    setCurrentStep("question");
    setQuestion("");
    setSelectedSpread(null);
    clearReading();
  };

  const handleBackToQuestion = () => {
    setCurrentStep("question");
    setQuestion("");
    setSelectedSpread(null);
    clearReading();
  };

  const handleBackToSpreadSelection = () => {
    setCurrentStep("spread-selection");
    setSelectedSpread(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "2rem 1rem",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            margin: "0 0 0.5rem 0",
            background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "bold",
          }}
        >
          🔮 오늘 뭐 뽑지?
        </h1>
        <p
          style={{
            margin: 0,
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.1rem",
          }}
        >
          당신의 미래를 들여다보세요
        </p>
      </header>

      {/* Navigation Breadcrumb */}
      {currentStep !== "question" && (
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.9rem",
          }}
        >
          <button
            onClick={handleBackToQuestion}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.8)",
              cursor: "pointer",
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.9rem",
            }}
          >
            질문 입력
          </button>
          <span>→</span>
          {currentStep === "spread-selection" ? (
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              스프레드 선택
            </span>
          ) : (
            <>
              <button
                onClick={handleBackToSpreadSelection}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.8)",
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                }}
              >
                스프레드 선택
              </button>
              <span>→</span>
              {currentStep === "card-drawing" ? (
                <span style={{ color: "#fff", fontWeight: "bold" }}>
                  카드 뽑기
                </span>
              ) : (
                <>
                  <span>카드 뽑기</span>
                  <span>→</span>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>
                    리딩 결과
                  </span>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <main style={{ width: "100%", maxWidth: "800px" }}>
        {currentStep === "question" && (
          <QuestionInput onQuestionSubmit={handleQuestionSubmit} />
        )}

        {currentStep === "spread-selection" && (
          <SpreadSelection
            onSpreadSelect={handleSpreadSelect}
            question={question}
          />
        )}

        {currentStep === "card-drawing" && selectedSpread && (
          <CardDrawing
            spread={selectedSpread}
            isDrawing={isDrawing}
            onDrawCards={handleDrawCards}
            question={question}
          />
        )}

        {currentStep === "reading-result" && currentReading && (
          <TarotReading
            reading={currentReading}
            onNewReading={handleNewReading}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          paddingTop: "3rem",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "0.8rem",
        }}
      >
        <p style={{ margin: 0 }}>
          타로는 참고용일 뿐입니다. 긍정적인 마음으로 미래를 만들어 가세요.
        </p>
      </footer>
    </div>
  );
}

export default App;
