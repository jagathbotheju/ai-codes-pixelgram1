import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Post, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import UserAvatar from "./UserAvatar";
import { ExtraPost } from "../../types";
import moment from "moment";
import PostOptions from "./PostOptions";
import { Card } from "./ui/card";
import Image from "next/image";
import PostActions from "./PostActions";
import Link from "next/link";
import Comments from "./Comments";

interface Props {
  post: ExtraPost;
}

const PostItem = async ({ post }: Props) => {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as User;
  const isPostOwner = post.userId === currentUser?.id;

  console.log(post);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col space-y-2.5 w-full">
      <div className="flex items-center justify-between px-3 sm:px-0 gap-2">
        <div className="flex gap-2">
          <div className="flex space-x-3 items-center">
            <UserAvatar user={post.user} />
          </div>
          <div className="text-sm">
            <p className="space-x-1">
              <span className="font-semibold">{post.user.name}</span>
              <span className="font-medium text-neutral-500 dark:text-neutral-400 text-xs">
                {moment(post.createdAt).fromNow()}
              </span>
            </p>
            <p className="text-xs text-black dark:text-white font-medium">
              Kurunegala, Sri Lanka
            </p>
          </div>
        </div>

        {/* post options */}
        {isPostOwner && <PostOptions post={post} />}
      </div>

      {/* post image */}
      <Card className="relative h-[450px] w-full overflow-hidden rounded-none md:rounded-md">
        <Image
          src={post.fileUrl}
          alt="post image"
          fill
          className="sm:rounded-md object-cover"
        />
      </Card>

      {/* post actions */}
      <PostActions post={post} currentUser={currentUser} />

      {/* post caption */}
      <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
        <p>{post.caption}</p>
        <Link href={`/dashboard/${post.userId}`}>
          <span className="italic">by</span> {post.user.name}
        </Link>
      </div>

      {/* comments */}
      <Comments
        post={post}
        currentUser={currentUser}
        comments={post.comments}
      />
    </div>
  );
};

export default PostItem;
