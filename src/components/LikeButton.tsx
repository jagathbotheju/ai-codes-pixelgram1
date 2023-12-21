"use client";
import { Like, User } from "@prisma/client";
import { ExtraPost } from "../../types";
import { useOptimistic, useTransition } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { likePost } from "@/lib/serverActions";
import { toast } from "sonner";

interface Props {
  post: ExtraPost;
  currentUser: User;
}

const LikeButton = ({ post, currentUser }: Props) => {
  const [isPending, startTransition] = useTransition();
  const predicate = (like: Like) =>
    like.userId === currentUser.id && like.postId === post.id;

  const [optimisticLikes, addOptimisticLike] = useOptimistic<Like[]>(
    post.likes,
    //@ts-ignore
    (state: Like[], newLike: Like) =>
      state.some(predicate)
        ? state.filter((like) => like.userId !== currentUser.id)
        : [...state, newLike]
  );

  return (
    <div className="flex flex-col items-center">
      <Button
        disabled={isPending}
        variant="ghost"
        onClick={() => {
          startTransition(() => {
            addOptimisticLike({ postId: post.id, userId: currentUser.id });
            likePost(post.id)
              .then((res) => {
                if (res.success) {
                  return toast.success(res.message);
                }
                toast.error(res.message);
              })
              .catch((err) => {
                toast.error(err.message);
              });
          });
        }}
      >
        <Heart
          className={cn("h-5 w-5 cursor-pointer", {
            "text-red-500 fill-red-500": optimisticLikes.some(predicate),
          })}
        />
      </Button>

      {optimisticLikes.length > 0 && (
        <p className="text-xs font-bold dark:text-white">
          {optimisticLikes.length}{" "}
          {optimisticLikes.length === 1 ? "Like" : "Likes"}
        </p>
      )}
    </div>
  );
};

export default LikeButton;
