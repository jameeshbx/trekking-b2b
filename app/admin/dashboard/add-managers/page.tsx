
import ManagerSection from "../../(components)/ManagersSection";
import { TopBarContainer } from "../../(components)/TobBarContainer";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10">
        <TopBarContainer />
      </div>
      <main className="min-h-screen p-6 md:p-8 lg:p-10">
        <ManagerSection />
      </main>
      </div>
  )
}
