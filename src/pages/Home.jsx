
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import "./Home.css";

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <SearchBar />
    </main>
  );
}
