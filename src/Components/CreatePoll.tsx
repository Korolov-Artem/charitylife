import { useState } from "react";
import { useCreatePollMutation } from "../services/pollsApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GUTTER = "mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16";
const GRID = "grid grid-cols-12 gap-x-6 lg:gap-x-10";
const KICKER = "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  const [createPoll, { isLoading }] = useCreatePollMutation();
  const navigate = useNavigate();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setError(null);
  };

  const addOption = () => {
    if (options.length >= 6) {
      setError("Maximum of 6 options allowed to maintain design integrity.");
      return;
    }
    setOptions([...options, ""]);
  };

  const removeOption = (indexToRemove: number) => {
    if (options.length <= 2) {
      setError("A poll must have at least 2 options.");
      return;
    }
    setOptions(options.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    if (!question.trim()) return setError("Please enter a question.");
    if (validOptions.length < 2)
      return setError("Please provide at least 2 valid options.");

    try {
      await createPoll({ question, options: validOptions }).unwrap();
      navigate("/");
    } catch (err) {
      setError("Failed to create the poll. Please try again.");
    }
  };

  return (
    <div className="bg-paper text-ink min-h-screen pb-24">
      <header className={`${GUTTER} pt-14 lg:pt-20 pb-8 border-b border-rule`}>
        <div className={`${GRID} items-end`}>
          <div className="col-span-12 lg:col-span-7">
            <span className={`${KICKER} text-accent`}>Editorial Desk</span>
            <h1 className="mt-4 font-display font-normal text-[2.75rem] lg:text-[4rem] leading-[1.0] tracking-[-0.025em]">
              Poll Studio
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-6 lg:mt-0 lg:pb-2 flex items-end justify-between gap-6">
            <p className="font-serif text-[0.9375rem] leading-[1.5] text-ink-soft max-w-[30ch]">
              Publishing here retires the poll currently running on the front
              page.
            </p>
            <button
              onClick={() => navigate(-1)}
              className={`${KICKER} text-ink-soft hover:text-accent transition-colors shrink-0`}
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      <div className={`${GUTTER} pt-12 lg:pt-16`}>
        <div className={GRID}>
          <div className="col-span-12 lg:col-span-5 lg:col-start-1">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div>
                <label className={`block ${KICKER} text-ink-soft mb-2`}>
                  The Prompt
                </label>
                <textarea
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setError(null);
                  }}
                  placeholder="What do you want to ask the readers?"
                  rows={2}
                  className="w-full resize-none appearance-none border-b border-rule bg-transparent px-0 py-3 font-display text-[1.75rem] lg:text-[2rem] leading-[1.15] tracking-[-0.015em] text-ink placeholder:text-ink-soft/40 focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className={`block ${KICKER} text-ink-soft mb-6`}>
                  Options
                </label>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {options.map((option, idx) => (
                      <motion.div
                        layout
                        key={`opt-input-${idx}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-baseline gap-4 group"
                      >
                        <span
                          className={`${KICKER} text-ink-soft tabular-nums shrink-0 w-6`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                          }
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 appearance-none border-b border-rule bg-transparent px-0 py-3 font-serif text-[1.0625rem] text-ink placeholder:text-ink-soft/40 focus:border-accent focus:outline-none transition-colors"
                        />
                        {options.length > 2 ? (
                          <button
                            type="button"
                            onClick={() => removeOption(idx)}
                            title="Remove option"
                            className="shrink-0 w-4 opacity-0 group-hover:opacity-100 text-ink-soft hover:text-accent transition-all duration-300"
                          >
                            ✕
                          </button>
                        ) : (
                          <div className="shrink-0 w-4" />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className={`mt-8 ${KICKER} text-ink-soft hover:text-accent transition-colors flex items-center gap-3`}
                  >
                    <span aria-hidden className="w-6 h-px bg-accent" />
                    Add Option
                  </button>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="font-serif italic text-[0.9375rem] leading-[1.5] text-accent border-l-2 border-accent pl-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
              >
                {isLoading ? "Publishing…" : "Publish Live Poll"}
              </button>
            </form>
          </div>

          {/* A replica of the published ballot down to the rules and numbering.
              A preview that renders differently from the live component is
              worse than no preview. */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 mt-16 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-4 mb-8">
                <span className={`${KICKER} text-ink-soft`}>Proof</span>
                <span aria-hidden className="flex-1 h-px bg-rule" />
              </div>

              <div className="border-t border-rule pt-10">
                <span className={`${KICKER} text-accent`}>Community Poll</span>
                <h2 className="mt-4 font-display text-[1.75rem] lg:text-[2.25rem] font-normal leading-[1.1] tracking-[-0.015em] text-balance max-w-[26ch]">
                  {question.trim() || "Your question will appear here"}
                </h2>

                <ol className="mt-10">
                  <AnimatePresence mode="popLayout">
                    {options.map((option, idx) => (
                      <motion.li
                        layout
                        key={`opt-preview-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-baseline gap-4 sm:gap-6 py-5 border-b border-rule"
                      >
                        <span
                          className={`${KICKER} text-ink-soft tabular-nums shrink-0`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`flex-1 font-serif text-[1.0625rem] leading-[1.5] ${
                            option.trim() ? "text-ink" : "text-ink-soft/50"
                          }`}
                        >
                          {option.trim() || `Option ${idx + 1}`}
                        </span>
                        <span
                          aria-hidden
                          className="shrink-0 w-6 h-px bg-rule"
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ol>

                <div className="mt-6">
                  <span className={`${KICKER} text-ink-soft`}>
                    0 Votes — Select to see results
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
