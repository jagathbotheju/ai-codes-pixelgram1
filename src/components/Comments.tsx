"use client";
import { Comment, User } from "@prisma/client";
import { ExtraComment, ExtraPost } from "../../types";
import { useOptimistic, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateCommentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { createComment } from "@/lib/serverActions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  post: ExtraPost;
  currentUser: User;
  comments: ExtraComment[];
}

const Comments = ({ post, currentUser, comments }: Props) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      body: "",
      postId: post.id,
    },
  });

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    ExtraComment[]
  >(
    post.comments,
    //@ts-ignore
    (state: ExtraComment[], newComment: string) => [
      {
        body: newComment,
        userId: currentUser.id,
        postId: post.id,
      },
      ...state,
    ]
  );

  const body = form.watch("body");
  const commentCount = optimisticComments.length;

  return (
    <div className="space-y-0.5 px-3 sm:px-0">
      {commentCount > 1 && (
        <Link
          href={`/post/${post.id}`}
          className="text-sm font-medium text-neutral-500"
        >
          View all {commentCount} comments
        </Link>
      )}

      {optimisticComments.slice(0, 3).map((comment, index) => (
        <div
          key={index}
          className="text-sm flex items-center space-x-2 font-medium"
        >
          <p>{comment.body}</p>
          <Link
            href={`/user/${comment?.userId}`}
            className="font-semibold text-sky-600"
          >
            - {comment?.user?.name}
          </Link>
        </div>
      ))}

      {/* add comment */}
      <Form {...form}>
        <form
          className="border-b border-gray-300 dark:border-neutral-800 pb-3 py-1 flex items-center space-x-2"
          onSubmit={form.handleSubmit((values) => {
            startTransition(() => {
              addOptimisticComment(values.body);
              createComment(values)
                .then((res) => {
                  if (res.success) {
                    form.reset();
                    return toast.success(res.message);
                  }
                  toast.error(res.message);
                })
                .catch((err) => {
                  toast.error(err.message);
                });
            });
          })}
        >
          <FormField
            control={form.control}
            name="body"
            render={({ field, fieldState }) => (
              <FormItem className="w-full flex">
                <FormControl>
                  <Input
                    type="text"
                    className="border-none bg-transparent px-0"
                    placeholder="Add a comment..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* submit button */}
          {body.trim().length > 0 && (
            <Button
              disabled={isPending}
              size="sm"
              className="disabled:hover:cursor-not-allowed py-1 h-fit text-sky-500 font-semibold hover:text-white bg-transparent hover:bg-transparent"
            >
              Post
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Comments;
