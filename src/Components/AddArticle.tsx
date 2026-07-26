import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useCreateArticleMutation } from "../services/articlesApi.ts";
import { useUploadMediaMutation } from "../services/mediaApi.ts";
import { Editor } from "./Editor.tsx";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  // 1. LOAD DRAFT ON MOUNT
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

  // 2. AUTO-SAVE DRAFT ON CHANGE
  useEffect(() => {
    const draft = {
      title,
      synopsis,
      theme,
      content,
      coverImageUrl,
      coverImageName,
    };
    // Only save if at least one field has some content to prevent saving empty drafts continuously
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

      // 3. CLEAR DRAFT ON SUCCESSFUL PUBLISH
      localStorage.removeItem(DRAFT_KEY);

      navigate("/");
    } catch (error) {
      console.error("Failed to publish:", error);
      setFormError("An error occurred while publishing. Please try again.");
    }
  };

  const isLoading = isUploading || isCreating;

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-0 pt-10">
      <button
        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#BD3900] transition-colors duration-300 mb-10"
        onClick={() => navigate("/")}
      >
        ⇚ Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 border-b border-black/10 pb-6">
          <h1 className="text-4xl lg:text-5xl font-serif text-black tracking-tight">
            Publish Editorial
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                placeholder="Enter a captivating title..."
                onChange={(e) => setTitle(e.target.value)}
                className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-2xl font-serif text-[#111827] placeholder-gray-400 hover:border-black/40 focus:border-[#BD3900] focus:outline-none transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                Theme / Category
              </label>
              <input
                type="text"
                value={theme}
                placeholder="e.g. Design, Health..."
                onChange={(e) => setTheme(e.target.value)}
                className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-lg text-[#111827] placeholder-gray-400 hover:border-black/40 focus:border-[#BD3900] focus:outline-none transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                Short Synopsis
              </label>
              <input
                type="text"
                value={synopsis}
                placeholder="A brief summary for the feed..."
                onChange={(e) => setSynopsis(e.target.value)}
                className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-lg text-[#111827] placeholder-gray-400 hover:border-black/40 focus:border-[#BD3900] focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
              Cover Image
            </label>
            <label className="flex flex-col items-center justify-center w-full h-40 px-4 transition-all duration-300 bg-[#FAFAFA] border border-black/10 rounded-sm shadow-inner appearance-none cursor-pointer hover:bg-white hover:border-[#BD3900] hover:shadow-md focus:outline-none group">
              <span className="flex flex-col items-center space-y-2">
                <span className="font-serif text-sm text-gray-500 group-hover:text-[#BD3900] transition-colors">
                  {isUploading ? (
                    <span className="text-gray-400 animate-pulse">
                      Archiving artwork...
                    </span>
                  ) : coverImageName ? (
                    <span className="text-[#BD3900] font-bold">
                      {coverImageName} (Ready)
                    </span>
                  ) : (
                    "Select a high-resolution cover image"
                  )}
                </span>
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

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
              Article Body
            </label>
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>

          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[#BD3900] text-sm font-serif italic text-center"
              >
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:cursor-pointer  hover:bg-[#BD3900] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Publishing Article..." : "Publish Article"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddArticle;
