// Đây là header của trang web
import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '~/redux/apiRequest';
import useRestoreState from '~/redux/useRestoreState';
import useUserId from '~/utils/useUserId';
import axios from 'axios';
import { useEffect } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { env } from '~/configs/environment.js';
import logo from '~/assets/Scout.ico';
import { io } from 'socket.io-client';
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
  const location_1 = useLocation();

  // Tạo mảng routes với điều kiện kiểm tra active
  const routes = [
    { name: 'Home', path: '/', check: path => path === '/' },
    {
      name: 'Discussion',
      path: '/discussion',
      check: path => path === '/discussion',
    },
    {
      name: 'Profile',
      path: `/profile/${userId}`,
      check: path => path.includes('/profile'),
    },
    {
      name: 'Search',
      path: '/search',
      check: path => path.includes('/search'),
    },
  ];
  const user = [
    { name: 'Storage', path: '/storage', check: path => path === '/storage' },
    {
      name: 'Change Password',
      path: '/changepassword',
      check: path => path === '/changepassword',
    },
  ];

  // Xác định active index dựa trên location
  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
    const index = routes.findIndex(route => route.check(location.pathname));
    setActiveIndex(index >= 0 ? index : null);
  }, [location]);
  const [activeIndex_1, setActiveIndex_1] = useState(null);
  useEffect(() => {
    const index = user.findIndex(route => route.check(location_1.pathname));
    setActiveIndex_1(index >= 0 ? index : null);
  }, [location_1]);

  //nếu ở page đó mà bấm vô page đó
  const [isBorderActive, setIsBorderActive] = useState(false);
  const [mobileBorderActiveIndex, setMobileBorderActiveIndex] = useState(null);

  const handleClick = (index, isMobile) => {
    const targetPath = routes[index].path;

    if (
      targetPath.includes('/profile') &&
      !location.pathname.includes(`/profile/${userId}`)
    ) {
      navigate(`/profile/${userId}`);
      return;
    }

    if (activeIndex === index) {
      if (isMobile) {
        setMobileBorderActiveIndex(index);
        setTimeout(() => setMobileBorderActiveIndex(null), 2000);
      } else {
        setIsBorderActive(true);
        setTimeout(() => setIsBorderActive(false), 2000);
      }
    }

    navigate(targetPath);
  };
  const handleClick_1 = (index, isMobile) => {
    const targetPath = user[index].path;

    if (activeIndex_1 === index) {
      if (isMobile) {
        setMobileBorderActiveIndex(index);
        setTimeout(() => setMobileBorderActiveIndex(null), 2000);
      } else {
        setIsBorderActive(true);
        setTimeout(() => setIsBorderActive(false), 2000);
      }
    }

    navigate(targetPath);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API_ROOT}/v1/Auth/${userId}`);
          setcurrentUserData(response.data);
          const avatarcontent = await axios.get(
            `${API_ROOT}/v1/Auth/get-avatar/${userId}`,
          );
          setAvatarUrl(avatarcontent.data.avatarUrl);
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

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(null);
        setOpenNotification(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  //Notification
  const socket = useRef(null);
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openNotification_1, setOpenNotification_1] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const lineHeight = '2rem';
  const numberOfVisibleLines = 10;

  useEffect(() => {
    socket.current = io(API_ROOT, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    if (currentUser) {
      socket.current.emit('registerUser', userId);
    }

    socket.current.on('newNotification', () => {
      fetchNotifications();
    });

    return () => {
      // However it not only the best solution! You need use hooks instead of using socket connection directly in view/component it can prevents multiple creation of socket connection.
      // Also socket connection should closed by backend if its not in use, whenever frontend is communicating or not.
      if (socket.readyState === 1) {
        socket.current.disconnect();
      }
    };
  }, [currentUser, userId]);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_ROOT}/v1/notification/${userId}`);
      setNotifications(response.data.notifications);
      setNotificationCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleNotificationClick = async () => {
    try {
      await axios.put(`${API_ROOT}/v1/notification/${userId}/mark-as-read`);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true })),
      );
      setNotificationCount(0);
      // setNotifications(prevNotifications => prevNotifications.map(notification =>
      //   notification._id === notificationId ? { ...notification, isRead: true } : notification
      // ));
      // setNotificationCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
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
              {routes.map((item, index) => (
                <div
                  key={index}
                  className={`w-[25%] h-full flex items-center justify-center hover:font-bold cursor-pointer z-10 ${
                    activeIndex === index && isBorderActive
                      ? 'border-2 border-red-500 animate-pulse rounded-[10px]'
                      : ''
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(activeIndex)} // Trở về activeIndex khi không hover
                  onClick={() => handleClick(index, false)}
                >
                  <span>{item.name}</span>
                </div>
              ))}

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
              ref={menuRef}
            >
              <div className="relative inline-flex items-center">
                <Bell
                  className="transition-colors duration-200 cursor-pointer mr-[10px]"
                  style={{ fill: 'none' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.fill = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.fill = 'none';
                  }}
                  onClick={() => {
                    setOpenNotification(!openNotification);
                    setOpen(false);
                    if (!openNotification) handleNotificationClick();
                  }}
                />
                {notificationCount > 0 && (
                  <div className="absolute top-[-8px] right-[2px] bg-red-500 text-white rounded-full px-2 text-xs font-bold">
                    {notificationCount}
                  </div>
                )}
              </div>
              <div
                className={`absolute right-0 top-[30px] mt-2 w-[300px] whitespace-nowrap rounded-lg bg-black bg-opacity-[80%] transition-all duration-300 transform overflow-x-hidden overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin ${
                  openNotification
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`}
                style={{
                  minWidth: '3rem',
                  height: `calc(${lineHeight} * ${numberOfVisibleLines})`,
                }}
              >
                <h1 className="text-[18px] pt-2 font-bold text-center">
                  Notifications
                </h1>
                <ul className="py-1">
                  {notifications?.length > 0 ? (
                    notifications.map(notification => (
                      <li
                        key={notification._id}
                        className={`px-4 py-2 cursor-pointer text-[16px] hover:bg-gray-700 text-wrap w-[300px] hover:font-bold   ${!notification.isRead ? 'font-bold' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          if (notification.postId) {
                            window.location.href = `${env.FE_ROOT}/post/${notification.postId}`;
                          }
                        }}
                      >
                        {notification.message}
                      </li>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-gray-400">No notifications</p>
                  )}
                </ul>
              </div>

              <div
                onClick={() => {
                  setOpen(!open);
                  setOpenNotification(false);
                }}
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
                      xmlns="https://www.w3.org/2000/svg"
                    >
                      <circle r="15" cx="15" cy="15" fill="#D9D9D9" />
                    </svg>
                  )}
                  <h5 className="ml-[5px] font-Raleway font-bold text-[22px] text-nowrap ">
                    {currentUserData?.username}
                  </h5>
                </a>
              </div>

              <div
                className={`absolute right-0 top-[30px] mt-2 w-[150px] whitespace-nowrap rounded-lg bg-black bg-opacity-[50%] transition-all duration-300 transform ${
                  open
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-5 pointer-events-none'
                }`}
              >
                <button className="flex h-10 w-full cursor-pointer items-center px-3 text-primary transition-all">
                  <Link to="/storage" className=" hover:cursor-pointer">
                    <p className="font-medium">Storage</p>
                  </Link>
                </button>
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
            {/*Menu nhỏ */}
            <div className="lg:hidden flex justify-end">
              <div className="relative inline-flex items-center">
                <Bell
                  className="transition-colors duration-200 mr-[10px] cursor-pointer"
                  style={{ fill: 'none' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.fill = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.fill = 'none';
                  }}
                  onClick={() => {
                    setOpenNotification_1(!openNotification_1);
                    if (!openNotification_1) handleNotificationClick();
                  }}
                />
                {notificationCount > 0 && (
                  <div className="absolute top-[-8px] right-[2px] bg-red-500 text-white rounded-full px-2 text-xs font-bold">
                    {notificationCount}
                  </div>
                )}
              </div>
              <button className=" z-10" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <X size={30} className="text-white" />
                ) : (
                  <Menu size={30} className="text-white" />
                )}
              </button>
            </div>
            <div
              className={`lg:hidden flex absolute right-0 top-[40px] mt-2 w-[300px] whitespace-nowrap rounded-lg bg-black bg-opacity-[80%] transition-all duration-300 transform z-100 overflow-x-hidden overflow-y-auto snap-y snap-mandatory scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-thin ${
                openNotification_1
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-5 pointer-events-none'
              }`}
              style={{
                minWidth: '3rem',
                height: `calc(${lineHeight} * ${numberOfVisibleLines})`,
              }}
            >
              <ul className="py-1">
                {notifications?.length > 0 ? (
                  notifications.map(notification => (
                    <li
                      key={notification._id}
                      className={`px-4 py-2 cursor-pointer text-[16px] hover:bg-gray-700 text-wrap w-[300px] hover:font-bold  ${!notification.isRead ? 'font-bold' : ''}`}
                      onClick={e => {
                        e.stopPropagation();
                        if (notification.postId) {
                          window.location.href = `${env.FE_ROOT}/post/${notification.postId}`;
                        }
                      }}
                    >
                      {notification.message}
                    </li>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-400">No notifications</p>
                )}
              </ul>
            </div>

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
                    xmlns="https://www.w3.org/2000/svg"
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
                  }
                    ${
                      activeIndex === index && mobileBorderActiveIndex === index
                        ? 'border-2 border-red-500 animate-pulse'
                        : ''
                    }
                  `}
                  onClick={() => handleClick(index, true)}
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
                <div className="h-[70px] grid-flow-row justify-start rounded-[10px] z-10 mt-[10px] ">
                  {user.map((item, index) => (
                    <div
                      key={index}
                      className={`h-[70px] flex items-center justify-start hover:font-bold cursor-pointer rounded-[10px] z-10 mt-[10px] hover:bg-slate-300/[.1] ${
                        item.check(location_1.pathname)
                          ? 'bg-blue-500/[.2]'
                          : ''
                      }
                    ${
                      activeIndex_1 === index &&
                      mobileBorderActiveIndex === index
                        ? 'border-2 border-red-500 animate-pulse'
                        : ''
                    }
                  `}
                      onClick={() => handleClick_1(index, true)}
                    >
                      <span className="text-[20px] pl-[10px]">
                        {item.name}
                        {item.check(location_1.pathname) && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                        )}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full h-full px-[5px] cursor-pointer mt-[10px]  hover:font-bold  hover:bg-slate-300/[.1] rounded-[10px]"
                  >
                    <Link to="/" className="w-full h-full flex items-center">
                      <p className="text-[20px] text-red-600">Log out</p>
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
