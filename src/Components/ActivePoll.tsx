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
      <div className="w-full py-16 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft animate-pulse">
        Loading Community Poll
      </div>
    );
  }

  if (isError || !poll) return null;

  const totalVotes = poll.options.reduce(
    (sum: number, opt: any) => sum + opt.votes,
    0,
  );

  const leadingVotes = poll.options.reduce(
    (max: number, opt: any) => Math.max(max, opt.votes),
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
    // A ballot set on the page, not a card floating above it: hairline rules and
    // paper, no shadow, no white panel.
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full my-16 border-t border-rule pt-10"
    >
      <header className="mb-10">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
          Community Poll
        </span>
        <h3 className="mt-4 font-display text-[1.75rem] lg:text-[2.25rem] font-normal text-ink leading-[1.1] tracking-[-0.015em] text-balance max-w-[26ch]">
          {poll.question}
        </h3>
      </header>

      <ol>
        {poll.options.map((opt: any, index: number) => {
          const percentage =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = userChoice === opt.id;
          const isLeading = opt.votes === leadingVotes && totalVotes > 0;

          // Bars are scaled against the leading option, not the total: with four
          // options a 30% winner is a stub against the full width, and the shape
          // of the result stops being readable.
          const barWidth =
            leadingVotes > 0 ? (opt.votes / leadingVotes) * 100 : 0;

          if (hasVoted) {
            return (
              <motion.li
                key={opt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="border-b border-rule py-5"
              >
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-sans text-[10px] font-semibold tracking-[0.18em] text-ink-soft tabular-nums shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`flex-1 font-serif text-[1.0625rem] leading-[1.5] ${
                      isSelected ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {opt.text}
                    {isSelected && (
                      <span className="ml-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                        Your vote
                      </span>
                    )}
                  </span>

                  <span
                    className={`font-sans text-[0.9375rem] font-semibold tabular-nums shrink-0 ${
                      isLeading ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>

                <div className="mt-3 ml-[calc(0.75rem+1.5rem)] sm:ml-[calc(0.75rem+2rem)] h-px bg-rule relative">
                  <motion.div
                    className={`absolute inset-y-0 left-0 h-px ${
                      isSelected ? "bg-accent" : "bg-ink/30"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{
                      duration: 1.1,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.15 + index * 0.08,
                    }}
                  />
                </div>
              </motion.li>
            );
          }

          return (
            <motion.li
              key={opt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <button
                onClick={() => handleVote(opt.id)}
                className="group w-full text-left flex items-baseline gap-4 sm:gap-6 py-5 border-b border-rule cursor-pointer"
              >
                <span className="font-sans text-[10px] font-semibold tracking-[0.18em] text-ink-soft tabular-nums shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="flex-1 font-serif text-[1.0625rem] leading-[1.5] text-ink group-hover:text-accent transition-colors duration-300">
                  {opt.text}
                </span>

                <span
                  aria-hidden
                  className="shrink-0 w-6 h-px bg-rule transition-all duration-500 group-hover:w-12 group-hover:bg-accent"
                />
              </button>
            </motion.li>
          );
        })}
      </ol>

      <footer className="mt-6 flex items-center gap-3">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft tabular-nums">
          {totalVotes.toLocaleString()} {totalVotes === 1 ? "Vote" : "Votes"}
        </span>
        {!hasVoted && (
          <>
            <span aria-hidden className="w-5 h-px bg-rule" />
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
              Select to see results
            </span>
          </>
        )}
      </footer>
    </motion.section>
  );
};

export default ActivePoll;
