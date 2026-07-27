import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMediaArchiveQuery } from "../services/mediaApi";
import { getImageUrl } from "./getImageUrl";

interface MediaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

const MediaDrawer: React.FC<MediaDrawerProps> = ({ isOpen, onClose, onSelectImage }) => {
  const { data: mediaAssets, isLoading, isError } = useGetMediaArchiveQuery({});

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#fafafa] shadow-2xl z-50 overflow-y-auto flex flex-col border-l border-black/10"
          >
            <div className="sticky top-0 bg-[#fafafa] z-10 px-6 py-5 border-b border-black/10 flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-[0.1em] text-black">
                Медіаархів
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {isLoading && (
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center mt-10">
                  Завантаження архіву…
                </div>
              )}

              {isError && (
                <div className="text-xs font-bold uppercase tracking-widest text-[#BD3900] text-center mt-10">
                  Не вдалося завантажити медіа.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {mediaAssets?.map((asset: any) => (
                  <div
                    key={asset._id}
                    className="group relative aspect-square bg-zinc-100 overflow-hidden cursor-pointer border border-black/5"
                    onClick={() => {
                      onSelectImage(getImageUrl(asset.url));
                      onClose();
                    }}
                  >
                    <img
                      src={getImageUrl(asset.url)}
                      alt={asset.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest text-center">
                        Вставити
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MediaDrawer;
