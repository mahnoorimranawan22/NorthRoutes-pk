import PageMeta from "../../components/common/PageMeta";
import HeroSection from "../../components/customer/HeroSection";
import StatsSection from "../../components/customer/StatsSection";

export default function Home() {
  return (
    <>
      <PageMeta title="Home - NorthRoutes PK" description="Discover the majestic north of Pakistan" />
      <HeroSection />
      <StatsSection />
    </>
  );
}
