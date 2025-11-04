import Image from "next/image";
import Sidebar from "./components/sidebar";

export default function Home() {
  return (
    <div> 
      <Sidebar />
      This is BG Page 
      <h1 className="text-red-500 text-center">Wait for it...</h1>
    </div>
  );
}
