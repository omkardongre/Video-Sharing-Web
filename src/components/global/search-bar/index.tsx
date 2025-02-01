"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "../search-results";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import { searchContent } from "@/actions/search";
import { SearchResultType } from "@/types/search";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedValue] = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedValue || debouncedValue.trim().length === 0) {
      setSearchResults(null);
      return;
    }

    const performSearch = async () => {
      try {
        setIsLoading(true);
        const result = await searchContent(debouncedValue);
        if (result.status === 200 && result.data) {
          setSearchResults(result.data);
        } else {
          setSearchResults(null);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-lg relative">
      <SearchIcon
        size={20}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <Input
        value={searchQuery}
        onChange={handleSearch}
        className="pl-10 bg-transparent border-0 text-foreground placeholder-muted-foreground"
        placeholder="Search for videos, folders & workspaces"
      />
      {(searchResults || isLoading) && (
        <SearchResults results={searchResults} isLoading={isLoading} />
      )}
    </div>
  );
};
