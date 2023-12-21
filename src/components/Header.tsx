"use client";
import { Heart, Search } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const searchSchema = z.object({
  search: z.string({
    required_error: "Please enter something to search...",
  }),
});
type Search = z.infer<typeof searchSchema>;

const Header = () => {
  const form = useForm<Search>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = (formData: Search) => {
    console.log(formData);
  };

  return (
    <div className="fixed flex top-0 md:hidden bg-white dark:bg-neutral-950 items-center justify-between w-full z-50 border-b border-zinc-300 dark:border-neutral-700 px-3 py-2 sm:-ml-6 flex-1 gap-x-4">
      <Link href="/dashboard">
        <p className="font-semibold text-xl">Pixelgram</p>
      </Link>

      <div className="flex items-center space-x-2 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            {/* search */}
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex relative items-center">
                      <Input placeholder="search" {...field} />
                      <Search className="w-5 h-5 -ml-8" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Button size="icon" variant="ghost">
          <Heart />
        </Button>
      </div>
    </div>
  );
};

export default Header;
