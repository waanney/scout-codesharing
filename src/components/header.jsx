// Đây là header của trang web
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '~/redux/apiRequest';
import useRestoreState from '~/redux/useRestoreState';
import useUserId from '~/utils/useUserId';
import axios from 'axios';
import { useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { env } from '~/configs/environment.js';
import logo from '~/assets/Scout.ico';
const API_ROOT = env.API_ROOT;

const HeaderForAllPages = () => {
  useRestoreState();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentUser =
    useSelector(state => state.auth.login.currentUser) ||
    JSON.parse(localStorage.getItem('currentUser'));
  const { isFetching, error } = useSelector(state => state.auth.logout);
  const userId = useUserId();
  const [currentUserData, setcurrentUserData] = useState(null);
  const [AvatarUrl, setAvatarUrl] = useState(null);

  const location = useLocation(); // Lấy thông tin location hiện tại

  // Tạo mảng routes với điều kiện kiểm tra active
  const routes = [
    { name: 'Home', path: '/', check: path => path === '/' },
    {
      name: 'Discussion',
      path: '/discussion',
      check: path => path === '/discussion',
    },
    { name: 'Storage', path: '/storage', check: path => path === '/storage' },
    {
      name: 'Profile',
      path: `/profile/${userId}`,
      check: path => path.includes('/profile'),
    },
  ];

  // Xác định active index dựa trên location
  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
    const index = routes.findIndex(route => route.check(location.pathname));
    setActiveIndex(index >= 0 ? index : null);
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API_ROOT}/v1/Auth/${userId}`);
          setcurrentUserData(response.data);
          const avatarcontent = await axios.get(
            `${API_ROOT}/v1/Auth/get-avatar/${userId}`,
            { responseType: 'blob' },
          );
          const avatarUrl = URL.createObjectURL(avatarcontent.data);
          setAvatarUrl(avatarUrl);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(dispatch, navigate);
    localStorage.removeItem('editableProfile');
    // localStorage.removeItem('currentUser'); //xóa thông tin trong localStorage
  };

  return (
    <div className="fixed w-full px-[10px] z-20 bg-[#0b2878] h-[80px]">
      {currentUser ? (
        <>
          <div className="mx-auto flex items-center justify-between">
            <a className="flex justify-between items-center mt-[10px]" href="/">
              <img
                className="h-[37px] w-[37px] mr-[5px]"
                src={logo}
                alt="Scout Logo"
              />
              <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
            </a>

            <div
              className="hidden lg:flex absolute left-1/2 -translate-x-1/2 mt-[20px] items-center justify-between bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px]"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {routes.map(
                (
                  item,
                  index, // Thay mảng cố định bằng routes
                ) => (
                  <div
                    key={index}
                    className="w-[25%] h-full flex items-center justify-center hover:font-bold cursor-pointer z-10"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(activeIndex)} // Trở về activeIndex khi không hover
                    onClick={() => navigate(item.path)}
                  >
                    <span>{item.name}</span>
                  </div>
                ),
              )}

              {(hoveredIndex !== null || activeIndex !== null) && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] transition-transform duration-300"
                  style={{
                    width: '25%',
                    transform: `translateX(calc(100% * ${hoveredIndex ?? activeIndex}))`,
                  }}
                ></div>
              )}
            </div>

            <div
              className="hidden lg:flex h-[30px] w-[20%] relative items-center space-x-1 cursor-pointer justify-end"
              onClick={() => setOpen(!open)}
            >
              <a className="flex items-center">
                {AvatarUrl ? (
                  <img
                    className="aspect-square h-[30px] w-[30px] rounded-full"
                    src={AvatarUrl}
                    alt="Avatar"
                  />
                ) : (
                  <svg
                    height="30"
                    width="30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                  </svg>
                )}
                <h5 className="ml-[5px] font-Raleway font-bold text-[22px] text-nowrap">
                  {currentUserData?.username}
                </h5>
              </a>

              <div
                className={`absolute right-0 top-[30px] mt-2 w-[150px] whitespace-nowrap rounded-lg bg-black bg-opacity-[50%] transition-all duration-300 transform ${
                  open
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`}
              >
                <button className="flex h-10 w-full cursor-pointer items-center px-3 text-primary transition-all">
                  <Link
                    to="/changepassword"
                    className="clickchangepassword hover:cursor-pointer"
                  >
                    <p className="font-medium">Change Password</p>
                  </Link>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex h-10 w-full cursor-pointer items-center px-3 text-red-600 transition-all hover:cursor-pointer"
                >
                  <Link to="/" className="clicklogout">
                    <p className="font-medium">Log out</p>
                  </Link>
                </button>
                {isFetching && <p>Logging out...</p>}
                {error}
              </div>
            </div>
            <button
              className="lg:hidden flex justify-end z-10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={30} className="text-white" />
              ) : (
                <Menu size={30} className="text-white" />
              )}
            </button>
            {/*Menu nhỏ */}
            <div
              className={`fixed top-0 left-0 h-full bg-[#0b2878] w-full p-6 transform transition-transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <a className="flex items-center">
                {AvatarUrl ? (
                  <img
                    className="aspect-square h-[30px] w-[30px] rounded-full"
                    src={AvatarUrl}
                    alt="Avatar"
                  />
                ) : (
                  <svg
                    height="30"
                    width="30"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                  </svg>
                )}
                <h5 className="ml-[5px] font-Raleway font-bold text-[22px] text-nowrap">
                  {currentUserData?.username}
                </h5>
              </a>
              {routes.map((item, index) => (
                <div
                  key={index}
                  className={`h-[70px] flex items-center justify-start hover:font-bold cursor-pointer rounded-[10px] z-10 mt-[10px] hover:bg-slate-300/[.1] ${
                    item.check(location.pathname) ? 'bg-blue-500/[.2]' : ''
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="text-[20px] pl-[10px]">
                    {item.name}
                    {item.check(location.pathname) && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                    )}
                  </span>
                </div>
              ))}
              <hr className="my-[5px]" />
              <div className="mt-[10px]">
                <div className="h-[70px] flex justify-start hover:font-bold cursor-pointer rounded-[10px] z-10 mt-[10px] hover:bg-slate-300/[.1]">
                  <button className="w-full h-full px-[5px]">
                    <Link
                      to="/changepassword"
                      className="clickchangepassword hover:cursor-pointer w-full h-full flex items-center"
                    >
                      <p className="font-medium text-[18px]">Change Password</p>
                    </Link>
                  </button>
                </div>

                <div className="h-[70px] flex justify-start hover:font-bold cursor-pointer rounded-[10px] z-10 hover:bg-slate-300/[.1]">
                  <button
                    onClick={handleLogout}
                    className="w-full h-full px-[5px] text-red-600"
                  >
                    <Link
                      to="/"
                      className="clicklogout w-full h-full flex items-center"
                    >
                      <p className="font-medium text-[18px]">Log out</p>
                    </Link>
                  </button>
                </div>

                {isFetching && <p>Logging out...</p>}
                {error}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto flex items-center justify-between">
            <a className="flex justify-between items-center mt-[10px]" href="/">
              <img
                className="h-[37px] w-[37px] mr-[5px]"
                src={logo}
                alt="Scout Logo"
              />
              <h4 className="text-[32px] font-bold font-raleway">Scout</h4>
            </a>

            <div
              className="hidden lg:flex absolute left-1/2 -translate-x-1/2 mt-[20px]  items-center justify-between bg-black bg-opacity-50 h-[68px] w-[498px] rounded-[10px]"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {['Home', 'Discussion', 'Storage', 'Profile'].map(
                (item, index) => (
                  <div
                    key={index}
                    className="w-[25%] h-full flex items-center justify-center hover:font-bold cursor-pointer z-10"
                    onMouseEnter={() => setHoveredIndex(index)} // Show span on hover
                    onClick={() => navigate('/login')}
                  >
                    <span>{item}</span>
                  </div>
                ),
              )}
              {hoveredIndex !== null && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3366CC] to-[#1A3366] rounded-[10px] transition-transform duration-300"
                  style={{
                    width: '25%',
                    transform: `translateX(calc(100% * ${hoveredIndex}))`,
                  }}
                ></div>
              )}
            </div>

            <div className="hidden lg:flex justify-between space-x-1">
              <Link to="/signup" className="clickSignup">
                <button className="h-[40px] w-[90px] bg-black text-white rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold">
                  Sign up
                </button>
              </Link>
              <Link to="/login" className="clickLogin">
                <button className="h-[40px] w-[90px] bg-white text-black rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold hover:bg-[#e0e0e0]">
                  Log in
                </button>
              </Link>
            </div>
            <button
              className="lg:hidden flex justify-end z-10"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={30} className="text-white" />
              ) : (
                <Menu size={30} className="text-white" />
              )}
            </button>
            <div
              className={`fixed top-0 left-0 h-full bg-[#0b2878] w-full p-6 transform transition-transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
              {['Home', 'Discussion', 'Storage', 'Profile'].map(
                (item, index) => (
                  <div
                    key={index}
                    className="h-[70px] flex items-center justify-start hover:font-bold cursor-pointer rounded-[10px] z-10 mt-[10px] hover:bg-slate-300/[.1]"
                    onClick={() => navigate('/login')}
                  >
                    <span className="text-[20px] pl-[10px]">{item}</span>
                  </div>
                ),
              )}
              <hr />
              <div className="flex gap-[20px] space-x-1 mt-[20px]">
                <Link to="/signup" className="clickSignup">
                  <button className="h-[40px] w-[90px] bg-black text-white rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold">
                    Sign up
                  </button>
                </Link>
                <Link to="/login" className="clickLogin">
                  <button className="h-[40px] w-[90px] bg-white text-black rounded-[10px] font-raleway text-[16px] cursor-pointer hover:font-bold hover:bg-[#e0e0e0]">
                    Log in
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderForAllPages;
