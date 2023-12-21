import { getPosts } from "@/lib/serverActions";
import PostItem from "./PostItem";
import { ExtraPost } from "../../types";

const Posts = async () => {
  const res = await getPosts();
  const posts = res.data as ExtraPost[];

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
