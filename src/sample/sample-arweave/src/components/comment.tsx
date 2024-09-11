import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MessageCircle } from "lucide-react";
import { createTransaction } from "arweavekit/transaction";
import { useUser } from "@/hooks/useUser";
import * as React from "react";
import { QueriedComment } from "@/types/query";
import { getComments } from "@/lib/query-comments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/spinner";
import { useToast } from "@/components/ui/use-toast";

const commentSchema = z.object({
  comment: z.string(),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  txId: string;
}

export function CommentDialog(props: CommentFormProps) {
  const { address } = useUser();
  const [comments, setComments] = React.useState<QueriedComment[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  async function onSubmit(values: CommentFormValues): Promise<void> {
    setIsLoading(true);
    try {
      const result = await createTransaction({
        type: "data",
        environment: "mainnet",
        data: values.comment,
        options: {
          tags: [
            {
              name: "Content-Type",
              value: "text/plain",
            },
            {
              name: "Data-Protocol",
              value: "comment",
            },
            {
              name: "Data-Source",
              value: props.txId,
            },
            {
              name: "Creator",
              value: address || "",
            },
          ],
          signAndPost: true,
        },
      });

      console.log(
        "Added comment successfully for:",
        props.txId,
        result.transaction
      );

      toast({
        title: "Success!",
        description: `Added comment successfully!`,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: error.message || "Unknown Error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const fetchCommentData = async () => {
    setIsCommentsLoading(true);
    try {
      const comments = await getComments(props.txId);
      console.log(comments);

      setComments(comments);
    } catch {
      console.log("Error fetching comments");
    } finally {
      setIsCommentsLoading(false);
    }
  };

  function trimAddress(str: string, startLength = 4, endLength = 3) {
    if (str.length <= startLength + endLength) {
      return str; // Return original string if it's too short
    }

    const start = str.substring(0, startLength);
    const end = str.substring(str.length - endLength);
    return `${start}...${end}`;
  }

  React.useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      fetchCommentData();
      form.reset({ comment: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState, form.reset, onSubmit]);

  return (
    <Dialog>
      <DialogTrigger onClick={() => fetchCommentData()} asChild>
        <button>
          <MessageCircle size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>See what others are saying</DialogTitle>
          <DialogDescription>And share your thoughts too.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-36 rounded-md border p-4">
          {isCommentsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size={28} />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-2 border-b">
                <strong>{trimAddress(comment.creatorId)}</strong>
                <p>{comment.comment}</p>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              No comments yet!
            </div>
          )}
        </ScrollArea>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 border-t"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pt-2">
                    Comment <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your comment" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {isLoading ? <Spinner /> : "Comment"}
              </Button>
            </DialogFooter>
            <p className="pt-2 text-xs text-muted-foreground">
              Comments may take sometime to load.
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
