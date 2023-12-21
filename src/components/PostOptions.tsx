"use client";
import { User } from "@prisma/client";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { FileEdit, MoreHorizontal, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTransition } from "react";
// import { deletePost } from "@/lib/serverActions";
import { ExtraPost } from "../../types";
import { deletePost } from "@/lib/serverActions";

interface Props {
  post: ExtraPost;
  className?: string;
}

const PostOptions = ({ post, className }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical
          className={cn(
            "h-5 w-5 cursor-pointer dark:text-neutral-400",
            className
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuGroup>
          {/* delete post */}
          <DropdownMenuItem
            onClick={() => {
              startTransition(async () => {
                deletePost(post)
                  .then((res) => {
                    if (res.success) {
                      toast.success(res.message);
                    } else {
                      toast.error(res.message);
                    }
                  })
                  .catch((err) => {
                    toast.error(err.message);
                  });
              });
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Delete Post</span>
          </DropdownMenuItem>

          {/* edit post */}
          <DropdownMenuItem>
            <FileEdit className="h-4 w-4 mr-2" />
            <span>Edit Post</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostOptions;
