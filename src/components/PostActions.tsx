"use client";
import { User } from "@prisma/client";
import { ExtraPost } from "../../types";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { MessageCircle } from "lucide-react";

interface Props {
  post: ExtraPost;
  currentUser: User;
}

const PostActions = ({ post, currentUser }: Props) => {
  return (
    <div className="relative flex items-start w-full gap-x-2 px-3 sm:px-0">
      <LikeButton post={post} currentUser={currentUser} />
      <Link
        href={`/post/${post.id}`}
        className={buttonVariants({ variant: "ghost" })}
      >
        <MessageCircle className="h-5 w-5" />
      </Link>
      <ShareButton post={post} />
      <BookmarkButton post={post} currentUser={currentUser} />
    </div>
  );
};

export default PostActions;
