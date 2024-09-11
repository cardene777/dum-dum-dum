"use client";

import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { postAsset } from "@/lib/post";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useUser } from "@/hooks/useUser";
import { Spinner } from "@/components/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";

// Accepted MIME types
const ACCEPTED_IMAGE_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// zod schema for form inputs
const imageSchema = z
  .any()
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    `.jpg, .jpeg, .png and .webp files are accepted`
  );

const formSchema = z.object({
  image: imageSchema,
  title: z.string(),
  creatorName: z.string().optional(),
  description: z.string().optional(),
  license: z.string().optional(),
  payment: z.string().optional(),
  tags: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  // license: z.string().optional(),
});

type InputFormValues = z.infer<typeof formSchema>;

export function InputForm() {
  const { connected, address: activeAddress } = useUser();
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // defining form based on zod schema
  const form = useForm<InputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      creatorName: "",
      description: "",
      license: "default",
      payment: "",
      tags: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control: form.control,
  });

  const { toast } = useToast();

  async function onSubmit(values: InputFormValues) {
    // This will be type-safe and validated.
    setIsLoading(true);
    try {
      const transactionId = await postAsset({
        file: values.image,
        title: values.title,
        description: values.description || "",
        license: values.license || "default",
        payment: values.payment || "",
        tags: values.tags || [],
        creatorName: values.creatorName || "",
        creatorId: activeAddress || "",
      });
      toast({
        title: "Success!",
        description: `Atomic asset uploaded!`,
        action: (
          <ToastAction
            altText="View Transaction"
            onClick={(e) => {
              e.preventDefault();
              window.open(`https://ar-io.dev/${transactionId}`, "_blank");
            }}
          >
            View Transaction
          </ToastAction>
        ),
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        description: error.message || "Unknown Error",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
      setPreview("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState, form.reset]);

  const licenseValue = form.watch("license");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-full"
      >
        {preview ? (
          <div className="w-full flex flex-col gap-6">
            <AspectRatio ratio={16 / 9} className="w-1/2 md:w-1/3 mx-auto">
              <Image
                src={preview}
                alt="Image"
                objectFit="contain"
                layout="fill"
                className="rounded-md object-cover"
              />
            </AspectRatio>
            <Button
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "hover:text-red-500"
              )}
              onClick={() => setPreview("")}
            >
              Clear Image
            </Button>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="image"
            render={({
              field: { onChange: onChangeField, value, ...rest },
            }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Image <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) =>
                        onChangeField(
                          e.target.files
                            ? (() => {
                                const file = e.target.files?.[0];
                                setPreview(URL.createObjectURL(file));
                                return file;
                              })()
                            : null
                        )
                      }
                      {...rest}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
        <div className="flex flex-col md:flex-row w-full gap-5">
          <div className="w-full md:w-1/2 space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator</FormLabel>
                  <FormControl>
                    <Input placeholder="creator name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4 flex-1 w-full">
            <div className="flex lg:flex-row flex-col gap-4">
              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-1/2">
                    <FormLabel>License</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={cn("w-full p-2")}>
                          <SelectValue placeholder="Choose License" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>License Options</SelectLabel>
                            <SelectItem value="default">
                              UDL Default Public Use
                            </SelectItem>
                            <SelectItem value="access">
                              UDL Restricted Access
                            </SelectItem>
                            <SelectItem value="commercial">
                              UDL Commercial Use - One Time Payment
                            </SelectItem>
                            <SelectItem value="derivative">
                              UDL Derivative Works - One Time Payment
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-1/2">
                    <FormLabel>
                      Payment{" "}
                      {licenseValue === "default" ? null : (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="License Fee in AR"
                        {...field}
                        disabled={licenseValue === "default"}
                        required={licenseValue !== "default"}
                        className={cn("w-full py-2")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Payment option disabled if License is &quot;UDL Default Public
              Use&quot;. For more advanced Licenses read this{" "}
              <Link
                href="https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it"
                target="_blank"
                className="underline"
              >
                wiki
              </Link>
              .
            </p>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`tags.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Tags
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add tags to your images.
                    </FormDescription>
                    <FormControl>
                      <div className="flex w-full gap-4">
                        <Input {...field} />
                        <Button
                          className={buttonVariants({
                            variant: "secondary",
                          })}
                          onClick={() => remove(index)}
                        >
                          X
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              className={buttonVariants({ variant: "secondary" })}
              onClick={() => append({ value: "" })}
              type="button"
            >
              Add Tag
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className={buttonVariants()}
          disabled={!connected}
        >
          {connected ? (
            isLoading ? (
              <Spinner size={28} />
            ) : (
              "Upload Image"
            )
          ) : (
            "Please connect to upload an asset."
          )}
        </Button>
      </form>
    </Form>
  );
}
