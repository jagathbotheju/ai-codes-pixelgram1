import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  fileUrl: z
    .string({
      required_error: "Please select a file",
    })
    .url(),
  caption: z.string().optional(),
});

export const CreatePost = PostSchema.omit({ id: true });
export const UpdatePost = PostSchema;
export const DeletePost = PostSchema.pick({ id: true });
export const LikeSchema = z.object({
  postId: z.string(),
});

export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  postId: z.string(),
});

export const CreateCommentSchema = CommentSchema.omit({ id: true });
export const UpdateCommentSchema = CommentSchema;
export const DeleteCommentSchema = CommentSchema.pick({ id: true });
