import { Post, User, Like, SavedPost, Comment } from "@prisma/client";

type ExtraPost = Post & {
  user: User;
  likes: Like[];
  savedBy: SavedPost[];
  comments: ExtraComment[];
};

type ExtraComment = Comment & {
  user: User;
};
