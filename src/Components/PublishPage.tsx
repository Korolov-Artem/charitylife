import AddArticle from "./AddArticle.tsx";

const PublishPage = () => {
  return (
    // Clean, responsive full-screen wrapper using our editorial background color
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white pb-20">
      <AddArticle />
    </div>
  );
};

export default PublishPage;
