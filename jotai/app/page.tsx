import Image from "next/image";
import { Search } from "@/app/ui/search";
import { List } from "@/app/ui/list/list";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Search />
      <List />
    </div>
  );
}
