import TennisVideo from "@/Components/TennisVideo";
import TennisVideoMobileNoPlatform from "@/Components/TennisVideoMobileNoPlatform";
import Subtitles from "@/Components/Subtitles";

export default function HomePage() {
  return (
    <>
      {/* Subtitles */}
      <div>
        <Subtitles />
      </div>

      {/* Page Content */}
      <div className="desktop-only">
        <TennisVideo />
      </div>

      <div className="mobile-only">
        <TennisVideoMobileNoPlatform />
      </div>

      {/* Top right link */}
      <div
        className="top-right-link"
        onClick={() => {
          window.top.location.href = "https://meikeludwigs.com/about/";
        }}
      >
        make it stop
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

        .top-right-link {
          position: fixed;
          top: 20px;
          right: 20px;
          color: #e6331b;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 65px;
          cursor: pointer;
          z-index: 1000;
          user-select: none;
        }

        .top-right-link:hover {
          color: #e6331bcc;
        }

        @media (min-width: 951px) {
          .top-right-link {
            font-size: 65px;
          }
        }

        @media (max-width: 950px) {
          .top-right-link {
            font-size: 30px;
          }
        }
      `}</style>
    </>
  );
}
