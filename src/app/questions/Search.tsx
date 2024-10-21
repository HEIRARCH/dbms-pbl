"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Search = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Set search state from URL parameter
    const [search, setSearch] = React.useState<string>(searchParams.get("search") || "");

    React.useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    // Debounce search input to avoid excessive rerendering
    const handleSearch = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const newSearchParams = new URLSearchParams(searchParams);

            // If search is empty, remove the search param
            if (search.trim()) {
                newSearchParams.set("search", search);
            } else {
                newSearchParams.delete("search");
            }

            router.push(`${pathname}?${newSearchParams}`);
        },
        [search, searchParams, pathname, router]
    );

    // Debounce function to avoid instant rerenders while typing
    const debounce = (func: (...args: any) => void, wait: number) => {
        let timeout: NodeJS.Timeout;
        return (...args: any) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Debounced search handler
    const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, 300);

    return (
        <form className="flex w-full flex-row gap-4" onSubmit={handleSearch}>
            <Input
                type="text"
                placeholder="Search questions"
                aria-label="Search questions"
                value={search}
                onChange={handleChange}
            />
            <button
                type="submit"
                className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                aria-label="Submit search"
            >
                Search
            </button>
        </form>
    );
};

export default Search;
