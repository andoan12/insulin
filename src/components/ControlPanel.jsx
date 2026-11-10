import React from 'react';
import {
  Dna,
  Scissors,
  Link2,
  Cpu,
  FlaskConical,
  CheckCircle2,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  HelpCircle
} from 'lucide-react';

const STEP_ICONS = {
  1: Dna,
  2: Scissors,
  3: Link2,
  4: Cpu,
  5: FlaskConical
};

const STEP_COLOR_CLASSES = {
  emerald: {
    activeBtn: 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/20',
    badge: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50',
    actionBtn: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950',
    iconActive: 'bg-emerald-400 text-slate-950'
  },
  amber: {
    activeBtn: 'border-amber-400 bg-amber-500/20 text-white shadow-lg shadow-amber-500/20',
    badge: 'bg-amber-500/25 text-amber-300 border-amber-400/50',
    actionBtn: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950',
    iconActive: 'bg-amber-400 text-slate-950'
  },
  rose: {
    activeBtn: 'border-rose-400 bg-rose-500/20 text-white shadow-lg shadow-rose-500/20',
    badge: 'bg-rose-500/25 text-rose-300 border-rose-400/50',
    actionBtn: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white',
    iconActive: 'bg-rose-400 text-slate-950'
  },
  cyan: {
    activeBtn: 'border-cyan-400 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/20',
    badge: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/50',
    actionBtn: 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950',
    iconActive: 'bg-cyan-400 text-slate-950'
  },
  violet: {
    activeBtn: 'border-violet-400 bg-violet-500/20 text-white shadow-lg shadow-violet-500/20',
    badge: 'bg-violet-500/25 text-violet-300 border-violet-400/50',
    actionBtn: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white',
    iconActive: 'bg-violet-400 text-slate-950'
  }
};

export default function ControlPanel({
  steps,
  currentStep,
  onSelectStep,
  actionDone,
  onToggleAction,
  completedSteps,
  onOpenQuiz
}) {
  const activeStepData = steps.find((s) => s.id === currentStep) || steps[0];
  const theme = STEP_COLOR_CLASSES[activeStepData.color] || STEP_COLOR_CLASSES.cyan;

  return (
    <aside className="w-full lg:w-[460px] xl:w-[510px] h-full bg-slate-900/95 border-l border-slate-800 flex flex-col z-20 shadow-2xl">
      {/* Top Header: Biology 10 Title */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              Sinh Học 10 • Công Nghệ Gen
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Đã hoàn thành {completedSteps.length}/5
            </span>
          </div>
          <h1 className="text-xl xl:text-2xl font-extrabold text-white tracking-tight mt-1">
            Quy Trình Sản Xuất Insulin Nhờ <span className="text-emerald-400 italic">E. coli</span>
          </h1>
        </div>
        <button
          onClick={onOpenQuiz}
          title="Câu hỏi trắc nghiệm ôn tập"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-xs transition shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ôn tập</span>
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* 5 Large Step-by-Step Buttons */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
            <span>CÁC BƯỚC QUY TRÌNH CÔNG NGHỆ GEN</span>
            <span className="text-cyan-400">Chọn bước để tương tác</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {steps.map((step) => {
              const Icon = STEP_ICONS[step.id] || Dna;
              const isCurrent = step.id === currentStep;
              const isDone = completedSteps.includes(step.id);
              const stepTheme = STEP_COLOR_CLASSES[step.color] || STEP_COLOR_CLASSES.cyan;

              return (
                <button
                  key={step.id}
                  onClick={() => onSelectStep(step.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3.5 group ${
                    isCurrent
                      ? stepTheme.activeBtn
                      : 'border-slate-800/90 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${
                      isCurrent
                        ? stepTheme.iconActive
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {isDone && !isCurrent ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-base xl:text-lg font-extrabold truncate ${
                          isCurrent ? 'text-white' : 'text-slate-100'
                        }`}
                      >
                        {step.shortTitle}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase rounded-md bg-white/15 text-white shrink-0">
                          Đang xem
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs xl:text-sm font-medium truncate mt-0.5 ${
                        isCurrent ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Trigger Button for Current Step */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-md border ${theme.badge}`}>
              {activeStepData.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Tương tác mô hình 3D
            </span>
          </div>

          <button
            onClick={onToggleAction}
            className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg transition-transform active:scale-[0.99] ${
              actionDone
                ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 hover:bg-emerald-500/30'
                : theme.actionBtn
            }`}
          >
            {actionDone ? (
              <>
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>Xem lại thao tác (Làm lại bước {currentStep})</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current shrink-0" />
                <span>{activeStepData.actionLabelBefore}</span>
              </>
            )}
          </button>

          {actionDone && (
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold bg-emerald-950/50 border border-emerald-500/30 px-3 py-2 rounded-lg">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{activeStepData.actionLabelAfter}</span>
            </div>
          )}
        </div>

        {/* Bold Presentation Text & Biological Explanation Card */}
        <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/80 space-y-3.5">
          <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Nội dung thuyết trình trọng tâm</span>
          </div>

          <h2 className="text-lg xl:text-xl font-extrabold text-white leading-snug">
            {activeStepData.headline}
          </h2>

          <ul className="space-y-2.5">
            {activeStepData.presentationPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm xl:text-base font-semibold text-slate-100 leading-relaxed"
              >
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Key Biological Terms for 10th-Grade Students */}
          <div className="pt-2 border-t border-slate-700/80 grid grid-cols-1 gap-2">
            {activeStepData.keyTerms.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs xl:text-sm"
              >
                <span className="font-extrabold text-amber-300">{item.term}: </span>
                <span className="font-medium text-slate-200">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Step Navigation Footer */}
      <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
        <button
          onClick={() => onSelectStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bước trước</span>
        </button>

        <div className="flex items-center gap-1.5">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectStep(s.id)}
              aria-label={`Bước ${s.id}`}
              className={`h-2.5 rounded-full transition-all ${
                s.id === currentStep
                  ? 'w-7 bg-cyan-400'
                  : completedSteps.includes(s.id)
                  ? 'w-2.5 bg-emerald-400'
                  : 'w-2.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => onSelectStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition"
        >
          <span>Bước tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
