"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { CreatePost } from "@/lib/schemas";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { createPost } from "@/lib/serverActions";
import useMount from "@/app/hooks/useMount";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CreatePage = () => {
  const mount = useMount();
  const router = useRouter();
  const pathname = usePathname();
  const isCreatePage = pathname === "/create";

  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      caption: "",
      fileUrl: undefined,
    },
  });
  const fileUrl = form.watch("fileUrl");

  if (!mount) return null;

  const onSubmit = (formData: z.infer<typeof CreatePost>) => {
    console.log("formData", formData);
    createPost(formData)
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          router.push("/");
        } else {
          toast.error(res.message);
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  return (
    <div>
      <Dialog
        open={isCreatePage}
        onOpenChange={(open) => !open && router.back()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Post</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {!!fileUrl ? (
                <div className="h-96 md:h-[450px] overflow-x-hidden rounded-md">
                  <AspectRatio ratio={1 / 1} className="relative h-full">
                    <Image
                      src={fileUrl}
                      alt="post preview"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel htmlFor="picture">Picture</FormLabel>
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            form.setValue("fileUrl", res[0].url);
                            toast.success("Upload complete");
                          }}
                          onUploadError={(error: Error) => {
                            console.error(error);
                            toast.error("Upload failed");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload a picture to post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!!fileUrl && (
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="caption">Caption</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="caption"
                          placeholder="Write a caption..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* submit button */}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create Post
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePage;
