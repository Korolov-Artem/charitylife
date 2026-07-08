import { useState } from "react";
import { useCreatePollMutation } from "../services/pollsApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
      navigate("/"); // Or navigate to the visual index / journal
    } catch (err) {
      setError("Failed to create the poll. Please try again.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 pb-20 font-sans min-h-screen">
      {/* HEADER */}
      <div className="mb-12 border-b border-black/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl lg:text-5xl font-serif text-black tracking-tight">
            Poll Studio
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#BD3900]">
            Warning: Publishing will archive the currently active poll.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          Cancel ➔
        </button>
      </div>

      {/* SPLIT SCREEN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        {/* LEFT COLUMN: THE EDITOR FORM */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Question Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                The Prompt
              </label>
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setError(null);
                }}
                placeholder="What do you want to ask the readers?"
                className="w-full resize-none appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-3xl font-serif text-black placeholder-gray-300 focus:border-[#BD3900] focus:outline-none transition-colors"
                rows={2}
              />
            </div>

            {/* Options Inputs */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                Poll Options
              </label>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {options.map((option, idx) => (
                    <motion.div
                      layout
                      key={`opt-input-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-4 group"
                    >
                      <span className="text-[10px] font-bold text-gray-300 w-4">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        placeholder={`e.g. Option ${idx + 1}`}
                        className="flex-1 appearance-none border-b border-black/10 bg-transparent px-2 py-3 text-lg text-black focus:border-[#BD3900] focus:outline-none transition-colors"
                      />
                      {options.length > 2 ? (
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#BD3900] text-xl transition-all duration-300"
                          title="Remove option"
                        >
                          ×
                        </button>
                      ) : (
                        <div className="w-4" /> // Spacer to keep alignment perfect
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-8 text-xs font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-colors flex items-center gap-2"
                >
                  <span className="text-[#BD3900]">+</span> Add Option
                </button>
              )}
            </div>

            {/* Error State */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[#BD3900] text-sm font-serif italic border-l-2 border-[#BD3900] pl-4 py-1"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-5 mt-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#BD3900] transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? "Broadcasting..." : "Publish Live Poll"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW (Sticky) */}
        <div className="w-full lg:w-1/2 relative">
          <div className="sticky top-24">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 text-right">
              Live Preview
            </label>

            {/* The Preview Card (Matches the exact styling we will use on the frontend) */}
            <div className="bg-white border border-black/10 p-8 lg:p-12 shadow-sm">
              <h2 className="font-serif text-2xl lg:text-3xl text-black leading-snug mb-10">
                {question.trim() || "Your question will appear here..."}
              </h2>

              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {options.map((option, idx) => (
                    <motion.div
                      layout
                      key={`opt-preview-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group border border-black/10 p-4 cursor-not-allowed bg-[#fafafa] flex items-center justify-between"
                    >
                      <span className="text-sm font-bold tracking-wide text-black">
                        {option.trim() || `Option ${idx + 1}`}
                      </span>
                      {/* Fake hover indicator for the preview */}
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                        Select
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
