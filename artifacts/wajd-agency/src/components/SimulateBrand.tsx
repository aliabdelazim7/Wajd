import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Link, Mail, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  pageUrl: z
    .string()
    .min(4, { message: "يرجى إدخال رابط الصفحة" }),
  email: z
    .string()
    .email({ message: "يرجى إدخال إيميل صحيح" }),
  phone: z
    .string()
    .min(8, { message: "يرجى إدخال رقم هاتف صحيح" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SimulateBrand() {
  const { toast } = useToast();
  const submitLead = useSubmitLead();
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { pageUrl: "", email: "", phone: "" },
  });

  const onSubmit = (values: FormValues) => {
    submitLead.mutate(
      { data: values },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "خطأ",
            description: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.",
          });
        },
      }
    );
  };

  return (
    <div className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container px-6 max-w-3xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
            تحليل البراند
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 inline-block relative">
            حلّل براندك مجاناً
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
          </h2>
          <p className="text-xl text-foreground/60 mt-6">
            حط رابط صفحتك وبياناتك — فريق وجد هيتواصل معاك بتحليل كامل
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#0a0a0a] border border-primary/30 rounded-3xl p-12 text-center shadow-[0_0_40px_rgba(212,175,55,0.1)]"
              data-testid="success-state"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle size={40} className="text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-3">تم الاستلام!</h3>
              <p className="text-foreground/60 text-lg mb-8">
                فريق وجد راح يتواصل معاك خلال 24 ساعة بتحليل كامل لبراندك
              </p>
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                data-testid="button-submit-another"
              >
                إرسال طلب آخر
              </Button>
            </motion.div>
          ) : (
            /* Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Page URL */}
                  <FormField
                    control={form.control}
                    name="pageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-base">
                          رابط الصفحة أو الموقع
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Link
                              size={18}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                            />
                            <Input
                              placeholder="https://instagram.com/yourpage"
                              dir="ltr"
                              className="h-14 pr-12 bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/30"
                              data-testid="input-page-url"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive text-right" />
                      </FormItem>
                    )}
                  />

                  {/* Email & Phone in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70 text-base">
                            الإيميل
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                              />
                              <Input
                                placeholder="example@gmail.com"
                                dir="ltr"
                                type="email"
                                className="h-14 pr-12 bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/30"
                                data-testid="input-email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-destructive text-right" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/70 text-base">
                            رقم الهاتف
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                              />
                              <Input
                                placeholder="+201234567890"
                                dir="ltr"
                                type="tel"
                                className="h-14 pr-12 bg-black/50 border-white/10 focus-visible:ring-primary/50 text-white placeholder:text-white/30"
                                data-testid="input-phone"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-destructive text-right" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitLead.isPending}
                    className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-black font-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all"
                    data-testid="button-submit-lead"
                  >
                    {submitLead.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin ml-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "اطلب تحليل البراند مجاناً"
                    )}
                  </Button>

                  <p className="text-center text-white/30 text-sm">
                    هيتواصل معاك فريق وجد خلال 24 ساعة
                  </p>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
