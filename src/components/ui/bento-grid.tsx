import React from "react";
import {
    CheckCircle,
    Bot,
    Globe,
    ShoppingCart,
    BarChart3,
    Plug,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface BentoItem {
    title: string;
    text: string;
    icon: string;
}

interface BentoGridProps {
    items: BentoItem[];
}

const iconByKey: Record<string, React.ReactNode> = {
    app: <CheckCircle className="h-4 w-4 text-blue-500" />,
    dashboard: <BarChart3 className="h-4 w-4 text-violet-500" />,
    automation: <Bot className="h-4 w-4 text-emerald-500" />,
    commerce: <ShoppingCart className="h-4 w-4 text-orange-500" />,
    ai: <Globe className="h-4 w-4 text-cyan-500" />,
    integrations: <Plug className="h-4 w-4 text-fuchsia-500" />,
} as const;

function BentoGrid({ items }: BentoGridProps) {
    return (
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 p-1 md:grid-cols-3">
            {items.map((item, index) => {
                return (
                    <article
                        key={`${item.title}-${index}`}
                        className={cn(
                            "opacity-0 [animation:bentoCardReveal_1400ms_cubic-bezier(0.16,1,0.3,1)_forwards]",
                            "group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 flex flex-col h-full",
                            "border-gray-200/90 bg-white hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
                            "dark:border-[#2A2A2A] dark:bg-[#111111] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]"
                        )}
                        style={{ animationDelay: `${index * 220}ms` }}
                    >
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
                        </div>

                        <div className="relative flex flex-col flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5 transition-all duration-300 group-hover:bg-gradient-to-br dark:bg-white/10">
                                    {iconByKey[item.icon] ?? <CheckCircle className="h-5 w-5 text-blue-500" />}
                                </div>
                                <span className="rounded-lg bg-black/5 px-3 py-1 text-xs font-medium text-gray-900 backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/10 dark:bg-white/10 dark:text-gray-200 dark:group-hover:bg-white/20">
                                    Active
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 flex flex-col justify-start">
                                <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{item.title}</h3>
                                <p className="text-sm font-[425] leading-relaxed text-gray-700 dark:text-gray-300">{item.text}</p>
                            </div>

                            <div className="pt-2 mt-auto flex flex-row items-center justify-between">
                                <div className="flex items-center space-x-2 text-xs text-gray-900 dark:text-gray-400">
                                    <span className="rounded-md bg-black/5 px-2 py-1 backdrop-blur-sm transition-all duration-200 hover:bg-black/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20">
                                        #servicio
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent via-gray-100/50 to-transparent p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/5" />
                    </article>
                );
            })}
        </div>
    );
}

export { BentoGrid };
