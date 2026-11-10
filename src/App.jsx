import React, { useState, useEffect } from 'react';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import { STEPS_DATA, QUIZ_QUESTIONS } from './data/stepsData';
import {
  Eye,
  EyeOff,
  RotateCcw,
  MousePointerClick,
  PlayCircle,
  PauseCircle,
  X,
  CheckCircle2,
  XCircle,
  Award
} from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  // Tracks whether the current step's interactive 3D action has been triggered
  const [stepActions, setStepActions] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });
  const [showLabels, setShowLabels] = useState(true);
  const [orbitResetKey, setOrbitResetKey] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Classroom Quiz modal state
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const activeStepData = STEPS_DATA.find((s) => s.id === currentStep) || STEPS_DATA[0];
  const actionDone = !!stepActions[currentStep];

  const completedSteps = Object.entries(stepActions)
    .filter(([, done]) => done)
    .map(([id]) => Number(id));

  // Trigger or toggle the 3D action for the current step
  const handleTriggerAction = () => {
    setStepActions((prev) => ({
      ...prev,
      [currentStep]: true
    }));
  };

  const handleToggleAction = () => {
    setStepActions((prev) => ({
      ...prev,
      [currentStep]: !prev[currentStep]
    }));
  };

  const handleSelectStep = (stepId) => {
    setCurrentStep(stepId);
  };

  // Optional classroom auto-presentation mode
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      if (!stepActions[currentStep]) {
        setStepActions((prev) => ({ ...prev, [currentStep]: true }));
      } else if (currentStep < STEPS_DATA.length) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setAutoPlay(false);
      }
    }, 3600);
    return () => clearTimeout(timer);
  }, [autoPlay, currentStep, stepActions]);

  // Keyboard shortcuts for classroom presentation (ArrowLeft / ArrowRight / Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (quizOpen) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleAction();
      } else if (e.code === 'ArrowRight') {
        setCurrentStep((prev) => Math.min(STEPS_DATA.length, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        setCurrentStep((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, quizOpen]);

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col lg:flex-row overflow-hidden select-none">
      {/* LEFT / CENTER: Interactive 3D Viewport */}
      <main className="relative flex-1 h-[54vh] lg:h-full overflow-hidden">
        {/* Top Classroom Presentation Banner Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-start justify-between gap-3 pointer-events-none">
          {/* Current Step Presentation Card */}
          <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border-2 border-slate-800/90 rounded-2xl px-4 py-3 shadow-2xl max-w-xl">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cyan-400">
              <span>Mô phỏng 3D Tương tác • Sinh học 10</span>
              <span>•</span>
              <span className="text-emerald-300">{activeStepData.badge}</span>
            </div>
            <div className="text-lg md:text-xl font-extrabold text-white mt-0.5">
              {activeStepData.shortTitle}: {activeStepData.subtitle}
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs md:text-sm font-bold text-amber-300">
              <MousePointerClick className="w-4 h-4 shrink-0 animate-bounce" />
              <span>{activeStepData.hint3D}</span>
            </div>
          </div>

          {/* 3D Viewport Toolbar Controls */}
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-xl">
            <button
              onClick={() => setAutoPlay((p) => !p)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                autoPlay
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {autoPlay ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Dừng tự động</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  <span>Trình chiếu tự động</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowLabels((s) => !s)}
              className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-extrabold text-slate-200 flex items-center gap-1.5 transition"
            >
              {showLabels ? (
                <>
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Nhãn 3D: Bật</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-slate-400" />
                  <span>Nhãn 3D: Tắt</span>
                </>
              )}
            </button>

            <button
              onClick={() => setOrbitResetKey((k) => k + 1)}
              className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-extrabold text-slate-200 flex items-center gap-1.5 transition"
              title="Đặt lại góc nhìn Camera 3D"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Góc nhìn chuẩn</span>
            </button>
          </div>
        </div>

        {/* Interactive 3D Canvas */}
        <Scene3D
          currentStep={currentStep}
          actionDone={actionDone}
          onTriggerAction={handleTriggerAction}
          showLabels={showLabels}
          orbitResetKey={orbitResetKey}
        />

        {/* Bottom Color Legend & Camera Controls Guide */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto flex flex-wrap items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-slate-800/90 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 shadow-lg">
            <span className="text-slate-400 uppercase tracking-wider">Chú giải mô hình:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              Plasmid E. coli
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              Gen Insulin người
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              Enzyme cắt / Đầu dính
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
              ADN vùng nhân / Dịch chiết Insulin
            </span>
          </div>

          <div className="pointer-events-auto hidden xl:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300">
            <span>Chuột trái: Xoay 3D</span>
            <span>•</span>
            <span>Con lăn: Thu phóng</span>
            <span>•</span>
            <span>Phím Space / Mũi tên: Chuyển bước</span>
          </div>
        </div>
      </main>

      {/* RIGHT: Classroom Step-by-Step Control Panel */}
      <ControlPanel
        steps={STEPS_DATA}
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        actionDone={actionDone}
        onToggleAction={handleToggleAction}
        completedSteps={completedSteps}
        onOpenQuiz={() => setQuizOpen(true)}
      />

      {/* Classroom Review Quiz Modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-7 h-7 text-amber-400" />
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    Câu Hỏi Củng Cố Bài Học (Sinh Học 10)
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    Chủ đề: Công nghệ ADN tái tổ hợp sản xuất Insulin nhờ vi khuẩn E. coli
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuizOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {QUIZ_QUESTIONS.map((q, qIdx) => {
                const picked = selectedAnswers[qIdx];
                const isAnswered = picked !== undefined;
                const isCorrect = picked === q.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
                  >
                    <div className="font-extrabold text-base text-white">
                      Câu {qIdx + 1}: {q.question}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isThisPicked = picked === oIdx;
                        const isThisCorrect = q.correctIndex === oIdx;

                        let btnStyle =
                          'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200';
                        if (isAnswered) {
                          if (isThisCorrect) {
                            btnStyle =
                              'border-emerald-400 bg-emerald-500/20 text-emerald-200';
                          } else if (isThisPicked) {
                            btnStyle = 'border-rose-400 bg-rose-500/20 text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                            }
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl border-2 font-bold text-sm flex items-center justify-between gap-2 transition ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isThisCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            )}
                            {isAnswered && isThisPicked && !isThisCorrect && (
                              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {isAnswered && (
                      <div
                        className={`text-xs font-bold p-3 rounded-xl border ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        Giải thích: {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedAnswers({})}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                Làm lại câu hỏi
              </button>
              <button
                onClick={() => setQuizOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-extrabold text-slate-950"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
