import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

/**
 * Shared furniture for the account screens. Legibility first, but still set in
 * the publication's type and rules rather than as a generic centred card —
 * left-aligned on a narrow measure, the way a form sits in the back matter.
 */

export const KICKER =
  "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

const FIELD =
  "w-full appearance-none border-b border-rule bg-transparent px-0 py-3 font-serif text-[1.125rem] text-ink placeholder:text-ink-soft/50 focus:border-accent focus:outline-none focus:ring-0 transition-colors duration-300";

export const AuthShell = ({
  kicker,
  title,
  standfirst,
  children,
}: {
  kicker: string;
  title: string;
  standfirst?: string;
  children: ReactNode;
}) => (
  <div className="bg-paper text-ink min-h-[calc(100svh-4rem)] flex items-center">
    <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-[26rem]"
      >
        <header className="pb-8 mb-10 border-b border-rule">
          <span className={`${KICKER} text-accent`}>{kicker}</span>
          <h1 className="mt-4 font-display font-normal text-[2.5rem] lg:text-[3rem] leading-[1.02] tracking-[-0.02em] text-balance">
            {title}
          </h1>
          {standfirst && (
            <p className="mt-3 font-serif text-[1rem] leading-[1.55] text-ink-soft text-pretty">
              {standfirst}
            </p>
          )}
        </header>

        {children}
      </motion.div>
    </div>
  </div>
);

export const Field = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) => (
  <div>
    <label htmlFor={id} className={`block ${KICKER} text-ink-soft mb-2`}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      autoComplete={autoComplete}
      className={FIELD}
    />
  </div>
);

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  required,
  autoComplete,
  action,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  /** Optional link rendered opposite the label, e.g. "Forgot?" */
  action?: ReactNode;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label htmlFor={id} className={`${KICKER} text-ink-soft`}>
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          className={`${FIELD} pr-16`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 ${KICKER} text-ink-soft hover:text-accent transition-colors`}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};

export const FormError = ({ children }: { children: ReactNode }) =>
  children ? (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="font-serif italic text-[0.9375rem] leading-[1.5] text-accent border-l-2 border-accent pl-4"
    >
      {children}
    </motion.p>
  ) : null;

export const SubmitButton = ({
  isLoading,
  idle,
  busy,
}: {
  isLoading: boolean;
  idle: string;
  busy: string;
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`w-full bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
  >
    {isLoading ? busy : idle}
  </button>
);

export const AuthNote = ({ children }: { children: ReactNode }) => (
  <div className="mt-10 pt-6 border-t border-rule">
    <p className={`${KICKER} text-ink-soft`}>{children}</p>
  </div>
);
