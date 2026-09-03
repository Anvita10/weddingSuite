export default function Footer({ hotelName = 'The Grand Aranya' }) {
  return (
    <footer className="px-5 py-10 text-center text-xs text-espresso/50 sm:px-10">
      {hotelName} — Wedding Suite. Calendar and estimate figures are indicative and confirmed by our team.
    </footer>
  );
}
