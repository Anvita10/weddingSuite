import { WeddingPlanProvider } from './hooks/WeddingPlanContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import StickyWhatsApp from './components/StickyWhatsApp.jsx';

import Hero from './sections/Hero.jsx';
import Explore from './sections/Explore.jsx';
import Imagine from './sections/Imagine.jsx';
import BuildWedding from './sections/BuildWedding.jsx';
import Availability from './sections/Availability.jsx';
import WeddingBoard from './sections/WeddingBoard.jsx';
import Stories from './sections/Stories.jsx';
import Venues from './sections/Venues.jsx';
import FAQ from './sections/FAQ.jsx';
import Visit from './sections/Visit.jsx';

const HOTEL_NAME = import.meta.env.VITE_HOTEL_NAME || 'The Grand Aranya';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export default function PublicSite() {
  return (
    <WeddingPlanProvider>
      <div className="min-h-screen bg-ivory">
        <Nav hotelName={HOTEL_NAME} />
        <Hero hotelName={HOTEL_NAME} />
        <Explore />
        <Imagine />
        <BuildWedding />
        <Availability />
        <WeddingBoard />
        <Stories />
        <Venues />
        <FAQ />
        <Visit />
        <Footer hotelName={HOTEL_NAME} />
        <StickyWhatsApp whatsappNumber={WHATSAPP_NUMBER} />
      </div>
    </WeddingPlanProvider>
  );
}
