import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import HeaderForAllPages from '~/components/header.jsx';
import FooterAllPage from '~/components/footer.jsx';
import ScrollTop from '~/components/scrollTop';
import usecheckTokenAndRedirect from '../services/checkTokenExpiration.jsx';
import devTeamLogo from '~/assets/Devteam.svg';
import ProfileImg from '~/assets/Profile.svg';
import Scoutlogo1 from '~/assets/Scout.svg';
import Scoutlogo2 from '~/assets/Scout.ico';
import DicussionImg from '~/assets/Discussion.png';
import StorageImg from '~/assets/Storage.svg';
import NewfeedImg from '~/assets/Newfeed.svg';
import PostImG from '~/assets/Posts.svg';
import BackgroundImg from '~/assets/Scout_blur.png';
import Scene from '../components/threedlogo.jsx';
import Name from '../components/threedname.jsx';
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
      img: devTeamLogo,
      title: '@DC1: Devteam-4',
      description:
        'We are 4 Devmems of Fessior - GDSC - HCMUT. Especially, we are all the freshmen of Computer Science of HCMUT - OISP.',
    },
    {
      img: Scoutlogo1,
      title: 'Scout',
      description:
        'It means Source Code Open for Universal Testing. We discuss about coding languages on this website.',
    },
    {
      img: ProfileImg,
      title: 'Profile',
      description:
        'Introduction about you. Everyone can get more information about you. Your posts and what you shared will be here, too.',
    },
    {
      img: Scoutlogo2,
      title: 'Discussion',
      description:
        'This is where your code is shared and enhanced by others suggestion',
      isTall: true,
      extraImg: DicussionImg,
    },
    {
      img: StorageImg,
      title: 'Storage',
      description: 'When you “Save” a post, it will be sent to Storage.',
    },
    {
      img: NewfeedImg,
      title: 'Rating Comments',
      description: 'You can rate the comments of others.',
    },
    {
      img: PostImG,
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
      return { backgroundSize: '400px 400px' }; // Mobile
    } else {
      return { backgroundSize: '500px 500px' }; // Desktop
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b2878] overflow-x-hidden">
      <HeaderForAllPages className="sticky" />
      
      <div className="h-screen w-full flex justify-center items-center">
        <Scene/>
      </div>

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
