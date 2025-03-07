/*trang web có 3 phần chính, header-body-footer, thì đây là code của footer*/

export default function FooterAllPage() {
  return (
    <footer className=" text-center text-surface/75 bg-[#05143c] dark:text-white/75 lg:text-left">
      <div className="flex items-center justify-center border-b-2 border-neutral-200 p-6 dark:border-white/10 lg:justify-between">
        <div className="me-12 hidden lg:block">
          <span>If website get stuck or error, please contact us:</span>
        </div>

        <div className="flex justify-center">
          {/* <a href="#!" className="me-6 [&>svg]:h-4 [&>svg]:w-4">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 448 512"
            ></svg>
          </a> */}
          <a href="#!" className="[&>svg]:h-4 [&>svg]:w-4">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 496 512"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              {/* <span className="me-3 [&>svg]:h-4 [&>svg]:w-4">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"></svg>
              </span> */}
              SCOUT: Source Code Open for Universal Testing
            </h6>
          </div>

          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Members
            </h6>
            <p className="mb-4 hover:underline">
              <a
                target="_blank"
                href="https://www.facebook.com/binh.ta.35380399"
              >
                Thanh Binh
              </a>
            </p>
            <p className="mb-4 hover:underline">
              <a target="_blank" href="https://www.facebook.com/minh.171106">
                Cong Minh
              </a>
            </p>
            <p className="mb-4 hover:underline">
              <a
                target="_blank"
                href="https://www.facebook.com/minh.quan.56650"
              >
                Minh Quan
              </a>
            </p>
            <p className="mb-4 hover:underline">
              <a
                target="_blank"
                href="https://www.facebook.com/profile.php?id=100025176580454"
              >
                Dang Khoi
              </a>
            </p>
          </div>

          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              GDSC: HCMUT
            </h6>
            <p className="mb-4 hover:underline">
              <a target="_blank" href="https://fessior.com/tools">
                Fessior Page
              </a>
            </p>
            <p className="mb-4 hover:underline">
              <a target="_blank" href="https://discord.gg/Rw6YCEKEBy">
                Discord
              </a>
            </p>
            <p className="mb-4 hover:underline">
              <a
                target="_blank"
                href="https://www.facebook.com/groups/gdschcmut"
              >
                Community
              </a>
            </p>
          </div>

          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </span>
              <a
                className="hover:underline"
                href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+B%C3%A1ch+khoa+-+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+Qu%E1%BB%91c+gia+TP.HCM/@10.772075,106.6530309,17z/data=!3m1!4b1!4m6!3m5!1s0x31752ec3c161a3fb:0xef77cd47a1cc691e!8m2!3d10.772075!4d106.6579018!16s%2Fm%2F025yhhq?entry=ttu&g_ep=EgoyMDI1MDMwMi4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D"
                target="_blank"
              >
                268 Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh
              </a>
            </p>
            <p className="mb-4 flex items-center justify-center md:justify-start">
              <span className="me-3 [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </span>
              <a
                className="hover:underline"
                href="https://mail.google.com/mail/?view=cm&to=minhnguyencong332@gmail.com"
                target="_blank"
              >
                minhnguyencong332@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
