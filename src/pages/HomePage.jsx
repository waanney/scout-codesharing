import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import HeaderForAllPages from '../components/header.jsx';
import FooterAllPage from '../components/footer.jsx';
import ScrollTop from '../components/scrollTop';
import usecheckTokenAndRedirect from '../services/checkTokenExpiration.jsx';
function HomePage() {
  usecheckTokenAndRedirect();
  const cardRefs = useRef([]);
  useEffect(() => {
    if (cardRefs.current.length) {
      cardRefs.current.forEach(card => {
        if (card) {
          VanillaTilt.init(card, {
            max: 10,
            speed: 800,
            glare: true,
            'max-glare': 0.2,
          });
        }
      });
    }

    return () => {
      cardRefs.current.forEach(card => {
        if (card?.vanillaTilt) {
          card.vanillaTilt.destroy();
        }
      });
    };
  }, []);

  const cardDetails = [
    {
      img: 'src/assets/Devteam.svg',
      title: '@DC1: Devteam-4',
      description:
        'We are 4 Devmems of Fessior - GDSC - HCMUT. Especially, we are all the freshmen of Computer Science of HCMUT - OISP.',
    },
    {
      img: 'src/assets/Scout.svg',
      title: 'Scout',
      description:
        'It means Source Code Open for Universal Testing. We discuss about coding languages on this website.',
    },
    {
      img: 'src/assets/Profile.svg',
      title: 'Profile',
      description:
        'Introduction about you. Everyone can get more information about you. Your posts and what you shared will be here, too.',
    },
    {
      img: 'src/assets/Scout.ico',
      title: 'Discussion',
      description:
        'This is where your code is shared and enhanced by others suggestion',
      isTall: true,
      extraImg: 'src/assets/Discussion.png',
    },
    {
      img: 'src/assets/Storage.svg',
      title: 'Storage',
      description: 'When you “Save” a post, it will be sent to Storage.',
    },
    {
      img: 'src/assets/Newfeed.svg',
      title: 'Rating Comments',
      description: 'You can rate the comments of others.',
    },
    {
      img: 'src/assets/Posts.svg',
      title: 'Posts',
      description:
        'When you have a coding problem or you want to share your codes with everyone, you can post them on Discussion.',
    },
  ];

  window.scrollTo({
    top: 0,
    behavior: 'auto',
  });

  const getBackgroundStyle = () => {
    if (window.innerWidth < 768) {
      return { backgroundSize: "400px 400px" }; // Mobile
    } else {
      return { backgroundSize: "500px 500px" }; // Desktop
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderForAllPages className="sticky" />
      <h1
        className="bg-fixed bg-cover font-raleway text-white/70 font-bold relative top-0 left-1/2 transform -translate-x-1/2 h-[500px] flex items-center justify-center text-center text-[48px] md:text-[60px] px-5 mt-[120px] mb-[90px] w-[700px]"
        style={{
          backgroundImage: "url('src/assets/Scout_blur.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          ...getBackgroundStyle(),
        }}
      >
        Source Code Open for Universal Testing
      </h1>

      <div className="relative p-[20px]">
        <h2 className="relative flex text-[60px] text-white font-bold w-full">
          Who are we?
        </h2>
        <div className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[34px_23px] mt-7 place-items-center">
          {cardDetails.map((card, index) => (
            <div
              key={index}
              ref={el => (cardRefs.current[index] = el)}
              className={`card ${
                card.isTall ? 'h-[536px] row-span-2' : 'h-[252px]'
              } w-[280px] bg-[#274494] rounded-[10px] border border-[#3653a3] text-left shadow-md`}
            >
              <img
                className="h-[44px] w-[44px] bg-black rounded-[9px] mt-[29px] mb-[19px] ml-[22px]"
                src={card.img}
                alt={card.title}
              />
              <span className="ml-[22px] mb-[18px] font-inter font-semibold text-[20px]">
                {card.title}
              </span>
              <p className="ml-[22px] w-[231px] font-inter font-medium text-[14px]">
                {card.description}
              </p>
              {card.extraImg && (
                <img
                  className="mt-[30px] ml-[27.5px]"
                  style={{ height: '280px', width: '223px' }}
                  src={card.extraImg}
                  alt="Extra"
                />
              )}
            </div>
          ))}
        </div>
        <ScrollTop />
      </div>
      <FooterAllPage />
    </div>
  );
}

export default HomePage;
