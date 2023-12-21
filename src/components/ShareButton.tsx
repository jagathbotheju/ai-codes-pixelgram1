"use client";
import { toast } from "sonner";
import { ExtraPost } from "../../types";
import { Button } from "./ui/button";
import { Link, Send } from "lucide-react";

interface Props {
  post: ExtraPost;
}

const ShareButton = ({ post }: Props) => {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        navigator.clipboard.writeText(
          `${window.location.origin}/post/${post.id}`
        );
        toast.success("Linked copies to clipboard", {
          icon: <Link className="h-5 w-5" />,
        });
      }}
    >
      <Send className="w-5 h-5" />
    </Button>
  );
};

export default ShareButton;
