import Image from "next/image";
import NavBar from "@/components/navBar";
import Welcome from "@/components/Welcome";
import InsiderTable from "@/components/InsiderTable";
export default function Home() {
  return (
    <div>
      <NavBar></NavBar>
      <Welcome></Welcome>
      <InsiderTable></InsiderTable>
    </div>
  );
}
