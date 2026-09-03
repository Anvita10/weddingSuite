export default function StickyWhatsApp({ whatsappNumber }) {
  const link = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I\'d like to know more about hosting our wedding with you.')}`
    : '#visit';

  return (
    <a
      href={link}
      target={whatsappNumber ? '_blank' : undefined}
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#3FA34D] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-black/25"
    >
      💬 Chat on WhatsApp
    </a>
  );
}
