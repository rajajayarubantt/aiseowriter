import BlogPageSection from "../../components/ui/BlogPageSection";

interface BlogPageProps {
  params?: object;
  searchParams?: object;
}

const BlogPage: React.FC<BlogPageProps> = ({ params }) => {
  return <BlogPageSection params={params} searchParams={params} />;
};

export default BlogPage;
