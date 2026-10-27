import { Trophy } from 'lucide-react';

// File name contains spaces and an en dash, so the URL is encoded
const PHOTO = encodeURI('/images/Best Performer – CHA Award.webp');

/** Featured announcement shown at the top of the Awards page (static content, independent of the CMS awards list). */
export default function AwardAnnouncement() {
  return (
    <section aria-labelledby="award-announcement-heading" className="pt-12 sm:pt-16 bg-white">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-[#e2e8e5] bg-[#fafcfb] shadow-xs">
          <figure className="lg:col-span-5 bg-brand-green-dark">
            <img
              src={PHOTO}
              alt="KPS receiving the Best Performer – CHA Award at the Chennai Port 145th Port Day celebration"
              width={1206}
              height={1100}
              loading="lazy"
              decoding="async"
              className="w-full h-auto sm:aspect-[16/10] lg:aspect-auto lg:h-full object-cover object-[45%_40%]"
            />
          </figure>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5 text-brand-yellow" aria-hidden="true" />
              <span>Award Announcement</span>
            </div>

            <h2
              id="award-announcement-heading"
              className="flex items-center gap-2 sm:gap-2.5 text-xl sm:text-3xl font-black tracking-tight text-brand-green-dark"
            >
              <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-amber-500 shrink-0" aria-hidden="true" />
              <span className="min-w-0">A Proud Moment for KPS!</span>
              <Trophy className="hidden sm:block w-7 h-7 text-amber-500 shrink-0" aria-hidden="true" />
            </h2>

            <p className="text-[15px] sm:text-base text-[#374151] leading-relaxed">
              We are proud to announce that KPS has received the <strong>“Best Performer – CHA” Award</strong> from Chennai
              Port Trust during its 145th Port Day celebration, presented by the Chairman of Chennai Port.
            </p>

            <p className="text-[15px] sm:text-base text-[#374151] leading-relaxed">
              We sincerely thank our valued customers for their trust and support, and our dedicated team for their hard
              work and commitment.
            </p>

            <p className="text-[15px] sm:text-base text-[#374151] leading-relaxed">
              This achievement belongs to the entire KPS family!
            </p>

            <p className="pt-4 border-t border-gray-200 text-[15px] sm:text-base text-brand-green-dark leading-relaxed">
              <span className="font-semibold">With pride and gratitude,</span>
              <br />
              <strong>Team KPS</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
