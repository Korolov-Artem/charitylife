import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useCreateArticleMutation } from "../services/articlesApi.ts";
import { useUploadMediaMutation } from "../services/mediaApi.ts";
import { Editor } from "./Editor.tsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GUTTER = "mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-16";
const GRID = "grid grid-cols-12 gap-x-6 lg:gap-x-10";
const KICKER = "font-sans text-[10px] font-semibold uppercase tracking-[0.24em]";

const FIELD =
  "w-full appearance-none border-b border-rule bg-transparent px-0 py-3 text-ink placeholder:text-ink-soft/40 focus:border-accent focus:outline-none transition-colors duration-300";

const AddArticle = () => {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [theme, setTheme] = useState("");
  const [content, setContent] = useState("");

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImageName, setCoverImageName] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const [uploadImage, { isLoading: isUploading }] = useUploadMediaMutation();
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const navigate = useNavigate();

  const DRAFT_KEY = "charity_life_article_draft";

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || "");
        setSynopsis(parsed.synopsis || "");
        setTheme(parsed.theme || "");
        setContent(parsed.content || "");
        setCoverImageUrl(parsed.coverImageUrl || null);
        setCoverImageName(parsed.coverImageName || null);
      } catch (error) {
        console.error("Failed to parse article draft", error);
      }
    }
  }, []);

  useEffect(() => {
    const draft = {
      title,
      synopsis,
      theme,
      content,
      coverImageUrl,
      coverImageName,
    };
    if (title || synopsis || theme || content || coverImageUrl) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [title, synopsis, theme, content, coverImageUrl, coverImageName]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormError(null);
      setCoverImageName(file.name);

      try {
        const uploadResponse = await uploadImage(file).unwrap();
        setCoverImageUrl(uploadResponse.url);
      } catch (error) {
        console.error("Cover image upload failed:", error);
        setFormError("Failed to upload the cover image to the archive.");
        setCoverImageName(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!coverImageUrl || !title || !content || !theme || !synopsis) {
      setFormError(
        "Please fill in all fields and wait for the cover image to finish uploading.",
      );
      return;
    }

    try {
      const articleData = {
        title,
        content,
        synopsis,
        theme,
        image: coverImageUrl,
      };

      await createArticle(articleData).unwrap();
      localStorage.removeItem(DRAFT_KEY);
      navigate("/");
    } catch (error) {
      console.error("Failed to publish:", error);
      setFormError("An error occurred while publishing. Please try again.");
    }
  };

  const isLoading = isUploading || isCreating;

  return (
    <div className="bg-paper text-ink min-h-screen pb-24">
      <header className={`${GUTTER} pt-14 lg:pt-20 pb-8 border-b border-rule`}>
        <div className={`${GRID} items-end`}>
          <div className="col-span-12 lg:col-span-7">
            <span className={`${KICKER} text-accent`}>Editorial Desk</span>
            <h1 className="mt-4 font-display font-normal text-[2.75rem] lg:text-[4rem] leading-[1.0] tracking-[-0.025em]">
              Publish Editorial
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 mt-6 lg:mt-0 lg:pb-2 flex items-end justify-between gap-6">
            <span className={`${KICKER} text-ink-soft`}>Draft saved locally</span>
            <button
              onClick={() => navigate("/")}
              className={`${KICKER} text-ink-soft hover:text-accent transition-colors shrink-0`}
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={`${GUTTER} pt-12 lg:pt-16`}>
        <div className={`${GRID} gap-y-12`}>
          {/* Title spans the measure it will be read at */}
          <div className="col-span-12 lg:col-span-8">
            <label
              htmlFor="title"
              className={`block ${KICKER} text-ink-soft mb-2`}
            >
              Article Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              placeholder="Enter a captivating title…"
              onChange={(e) => setTitle(e.target.value)}
              className={`${FIELD} font-display text-[1.75rem] lg:text-[2.5rem] leading-[1.1] tracking-[-0.02em]`}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <label
              htmlFor="theme"
              className={`block ${KICKER} text-ink-soft mb-2`}
            >
              Theme / Section
            </label>
            <input
              id="theme"
              type="text"
              value={theme}
              placeholder="Design, Health…"
              onChange={(e) => setTheme(e.target.value)}
              className={`${FIELD} font-serif text-[1.0625rem]`}
            />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <label
              htmlFor="synopsis"
              className={`block ${KICKER} text-ink-soft mb-2`}
            >
              Standfirst
            </label>
            <input
              id="synopsis"
              type="text"
              value={synopsis}
              placeholder="One sentence to set up the piece…"
              onChange={(e) => setSynopsis(e.target.value)}
              className={`${FIELD} font-serif text-[1.0625rem]`}
            />
          </div>

          {/* Cover — a hairline plate slot, not a dropzone card */}
          <div className="col-span-12 lg:col-span-4">
            <span className={`block ${KICKER} text-ink-soft mb-2`}>
              Cover Image
            </span>
            <label className="group flex items-center justify-between gap-4 w-full border-b border-rule py-3 cursor-pointer hover:border-accent transition-colors duration-300">
              <span
                className={`font-serif text-[1.0625rem] truncate ${
                  coverImageName ? "text-ink" : "text-ink-soft/60"
                }`}
              >
                {isUploading
                  ? "Archiving artwork…"
                  : coverImageName || "Select a high-resolution image"}
              </span>
              <span
                className={`${KICKER} shrink-0 ${
                  coverImageUrl ? "text-accent" : "text-ink-soft"
                } group-hover:text-accent transition-colors`}
              >
                {coverImageUrl ? "Ready" : "Browse"}
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
            </label>
          </div>

          <div className="col-span-12">
            <label className={`block ${KICKER} text-ink-soft mb-3`}>
              Article Body
            </label>
            <div className="border border-rule bg-paper min-h-[400px]">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-4">
            <AnimatePresence>
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="mb-6 font-serif italic text-[0.9375rem] leading-[1.5] text-accent border-l-2 border-accent pl-4"
                >
                  {formError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
            >
              {isCreating ? "Publishing…" : "Publish Article"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddArticle;
