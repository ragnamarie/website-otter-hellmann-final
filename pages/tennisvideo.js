import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobile from "@/Components/TennisVideoMobile";

export default function TennisPageWithVideo() {
  return (
    <>
      <div className="desktop-only">
        <TennisVideo />
      </div>
      <div className="mobile-only">
        <TennisVideoMobile />
      </div>

      <style jsx>{`
        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 950px) {
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: block;
          }
        }

        @media (min-width: 951px) {
          .desktop-only {
            display: block;
          }
          .mobile-only {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
