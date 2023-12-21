"use server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "./getUser";
import { CreateCommentSchema, CreatePost } from "./schemas";
import { z } from "zod";
import { ExtraPost } from "../../types";

// 1-USER SIGN UP
// 2-POST CREATE
// 3-POSTS GET
// 4-POST DELETE
// 5-POST LIKE
// 6-POST BOOKMARK
// 7-COMMENT CREATE

// 1-USER SIGN UP
export const signUpUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const exist = await prisma.user.findUnique({
      where: { email },
    });
    if (exist) {
      return {
        success: false,
        message: "Email address already inuse, please choose another address",
      };
    }
    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashedPw,
      },
    });
    if (!newUser) {
      return {
        success: false,
        message: "Unable to create user, try again later.",
      };
    }

    const { hashedPassword, ...noPasswordUser } = newUser;

    return {
      success: true,
      data: noPasswordUser,
    };
  } catch (error) {
    console.log("server error", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

// 2-POST CREATE
export const createPost = async (formData: z.infer<typeof CreatePost>) => {
  const user = await getUser();
  const validatedFields = CreatePost.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields, Failed to create Post",
    };
  }

  const { fileUrl, caption } = validatedFields.data;
  console.log("create post - caption", caption);

  try {
    const newPost = await prisma.post.create({
      data: {
        caption,
        fileUrl,
        user: {
          connect: { id: user.id },
        },
      },
    });

    if (!newPost) {
      return {
        success: false,
        message: "Unable to create post!",
      };
    }

    revalidatePath("/");
    //redirect("/");

    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Database Error, failed to crate post",
    };
  }
};

// 3-POST GET
export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        likes: {
          include: { user: true },
        },
        savedBy: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!posts) {
      return {
        success: false,
        message: "Error getting posts",
      };
    }

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal Sever Error",
    };
  }
};

// 4-POST DELETE
export const deletePost = async (post: ExtraPost) => {
  const user = await getUser();
  try {
    if (post.user.id === user.id) {
      const deletedPost = await prisma.post.delete({
        where: {
          id: post.id,
        },
      });

      if (!deletedPost) {
        return {
          success: false,
          message: "Error deleting post",
        };
      }

      revalidatePath("/");
      return {
        success: true,
        message: "Post deleted successfully",
      };
    }

    return {
      success: false,
      message: "No authorized to delete this post",
    };
  } catch (error) {
    return {
      success: false,
      message: "Delete Post - Internal Sever Error",
    };
  }
};

// 5-POST LIKE
export const likePost = async (postId: string) => {
  const currentUser = await getUser();

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (post) {
      const like = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: currentUser.id,
          },
        },
      });

      //if like post found -unlike it
      if (like) {
        const unlikedPost = await prisma.like.delete({
          where: {
            postId_userId: {
              postId,
              userId: currentUser.id,
            },
          },
        });

        if (unlikedPost) {
          revalidatePath("/");
          return {
            success: true,
            message: "You unliked post",
          };
        }
      } else {
        //if like post not found-like it
        const likedPost = await prisma.like.create({
          data: {
            postId,
            userId: currentUser.id,
          },
        });

        if (likedPost) {
          revalidatePath("/");
          return {
            success: true,
            message: "You liked post",
          };
        }
      }
    }

    return {
      success: false,
      message: "Error liking post",
    };
  } catch (error) {
    return {
      success: false,
      message: "Like Post - Internal Server Error",
    };
  }
};

// 6-POST BOOKMARK
export const bookmarkPost = async (postId: string) => {
  const currentUser = await getUser();
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (post) {
      const bookmark = await prisma.savedPost.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: currentUser.id,
          },
        },
      });

      //if bookmark find-delete bookmark
      if (bookmark) {
        const deletedBookmark = await prisma.savedPost.delete({
          where: {
            postId_userId: {
              postId,
              userId: currentUser.id,
            },
          },
        });

        if (deletedBookmark) {
          revalidatePath("/");
          return {
            success: true,
            message: "Bookmark deleted successfully",
          };
        }
      } else {
        //bookmark not found-create one
        const newBookmark = await prisma.savedPost.create({
          data: {
            postId,
            userId: currentUser.id,
          },
        });

        if (newBookmark) {
          revalidatePath("/");
          return {
            success: true,
            message: "Bookmark Created Successfully",
          };
        }
      }
    }

    return {
      success: false,
      message: "Error creating Bookmark",
    };
  } catch (error) {
    return {
      success: false,
      message: "Bookmark Post - Internal Server Error",
    };
  }
};

// 7-COMMENT CREATE
export const createComment = async (
  values: z.infer<typeof CreateCommentSchema>
) => {
  try {
    const currentUser = await getUser();
    const validFields = CreateCommentSchema.safeParse(values);
    if (!validFields.success) {
      return {
        success: false,
        message: "Invalid Fields",
      };
    }

    const { body, postId } = validFields.data;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (post) {
      const comment = await prisma.comment.create({
        data: {
          body,
          postId,
          userId: currentUser.id,
        },
      });

      if (comment) {
        revalidatePath("/");
        return {
          success: true,
          message: "Comment created successfully",
        };
      }
    }

    return {
      success: false,
      message: "Error crating comment",
    };
  } catch (error) {
    return {
      success: false,
      message: "Create Comment - Internal Server Error",
    };
  }
};
