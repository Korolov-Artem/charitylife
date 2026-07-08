import { useEffect, useState } from "react";
import {
  useGetActivePollQuery,
  useSubmitVoteMutation,
} from "../services/pollsApi";
import { motion } from "framer-motion";

const ActivePoll = () => {
  const { data: poll, isLoading, isError } = useGetActivePollQuery(undefined);
  const [submitVote] = useSubmitVoteMutation();

  const [hasVoted, setHasVoted] = useState(false);
  const [userChoice, setUserChoice] = useState<string | null>(null);

  const pollId = poll?._id || poll?.id;

  useEffect(() => {
    if (pollId) {
      const savedVote = localStorage.getItem(`poll_vote_${pollId}`);
      if (savedVote) {
        setHasVoted(true);
        setUserChoice(savedVote);
      } else {
        setHasVoted(false);
        setUserChoice(null);
      }
    }
  }, [pollId]);

  if (isLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400 animate-pulse">
        Loading Community Poll...
      </div>
    );
  }

  if (isError || !poll) return null;

  const totalVotes = poll.options.reduce(
    (sum: number, opt: any) => sum + opt.votes,
    0,
  );

  const handleVote = async (optionId: string) => {
    if (hasVoted) return;

    setHasVoted(true);
    setUserChoice(optionId);
    localStorage.setItem(`poll_vote_${pollId}`, optionId);

    try {
      await submitVote({ pollId, optionId }).unwrap();
    } catch (error) {
      console.error("Failed to submit vote", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      // Replaced the harsh border with a soft, expansive shadow and pure white background
      className="w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:p-14 my-16"
    >
      {/* THE HEADER - Centered for better typographic presence */}
      <div className="mb-12 text-center flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD3900] mb-4 block">
          Community Poll
        </span>
        <h3 className="text-3xl lg:text-4xl font-serif text-black leading-tight max-w-2xl">
          {poll.question}
        </h3>
      </div>

      {/* THE OPTIONS / RESULTS */}
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {poll.options.map((opt: any, index: number) => {
          const rawPercentage =
            totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
          const percentage = Math.round(rawPercentage);
          const isSelected = userChoice === opt.id;

          if (hasVoted) {
            // --- STATE 2: THE REVEAL (Results) ---
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`relative overflow-hidden border p-6 flex flex-col justify-center transition-colors duration-500 ${
                  isSelected
                    ? "border-[#BD3900]/30 bg-[#BD3900]/[0.02]"
                    : "border-zinc-100 bg-white"
                }`}
              >
                {/* Text and Percentage Container */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <span
                    className={`font-bold text-sm uppercase tracking-wide ${
                      isSelected ? "text-[#BD3900]" : "text-gray-500"
                    }`}
                  >
                    {opt.text} {isSelected && " ✓"}
                  </span>
                  <span
                    className={`text-sm font-bold ${isSelected ? "text-[#BD3900]" : "text-gray-400"}`}
                  >
                    {percentage}%
                  </span>
                </div>

                {/* Independent Progress Bar */}
                <div className="w-full h-1 bg-zinc-100 overflow-hidden relative z-10">
                  <motion.div
                    className={`h-full ${isSelected ? "bg-[#BD3900]" : "bg-zinc-300"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 1.2,
                      ease: [0.32, 0.72, 0, 1],
                      delay: 0.2,
                    }}
                  />
                </div>
              </motion.div>
            );
          }

          // --- STATE 1: THE ASK (Voting) ---
          return (
            <motion.button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative w-full border border-zinc-200 bg-white p-6 flex items-center justify-between hover:border-black/20 hover:shadow-sm transition-all duration-300 text-left cursor-pointer"
            >
              <span className="font-bold text-sm uppercase tracking-wide text-black group-hover:translate-x-2 transition-transform duration-300">
                {opt.text}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#BD3900] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Select ➔
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* FOOTER METADATA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {totalVotes.toLocaleString()} Total Votes
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ActivePoll;
