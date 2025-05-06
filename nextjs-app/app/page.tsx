import Image from "next/image";
import NavBar from "@/components/navBar";
import Welcome from "@/components/Welcome";
import InsiderTable from "@/components/InsiderTable";
import ProgressBanner from "@/components/ProgressBanner";

export default function Home() {
  return (
    <div>
      <ProgressBanner />
      <NavBar></NavBar>
      <Welcome></Welcome>
      <div id="insider-transactions-anchor" style={{position: 'relative', padding: '0.8 rem', height: '20px', width: '100%'}}></div>
      <InsiderTable></InsiderTable>
    </div>
  );
}
