import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppContext, {useAppContext} from './Context';
import {
  setAuthorizationHeader,
  removeAuthorizationHeader,
  getFetcher,
  URIS,
} from '../services/api';
import {useCallback} from 'react';
import {
  getUserSurvey,
  logoutAction,
  requestUserProfileAction,
  updateUserDevice,
} from '../redux/reducers/user';
import {useCheckStatus} from '../utils/useCheckStatus';
import {Button, Center, Spinner, Text, useToast} from '@chakra-ui/react';
import {getDefaultDataAction} from '../redux/reducers/lmsConfig';
import {useCookies} from 'react-cookie';
import {
  getPkgContentsAction,
  getWebsitePackageAction,
} from '../redux/reducers/packages';
// import {getWishlistAction} from '../redux/reducers/wishlist';
import {useHistory, useLocation} from 'react-router-dom';
import _, {size, split} from 'lodash';
import {requestCourseTrackingsAction} from '../redux/tracking';
import {isSSR} from '../utils/ssrHelper';
import {apis} from '../services/api/apis';
import {strApiBaseUrl} from '../BaseUrl';
import {useQueryParams} from '../utils/useQueryParams';
global._ = _;

export const token = React.createRef();

let hostname;
if (!isSSR) {
  hostname = window.location.hostname;
  hostname = split(hostname, '.');
  if (hostname.length > 1) {
    hostname =
      hostname[size(hostname) - 2] + '.' + hostname[size(hostname) - 1];
  } else {
    hostname = hostname[0];
  }
}

export const AppProvider = ({children, navigation}) => {
  const query = useQueryParams();
  const qtoken = query.get('token');

  const [navBarLinks, setNavBarLinks] = useState(false);
  if (isSSR) {
  } else {
    // const urlSearchParams = new URLSearchParams(window.location.search);
    // const params = Object.fromEntries(urlSearchParams.entries());
  }
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies();

  const {status, user, student} = useSelector(s => ({
    status: s.user.status,
    user: s.user.user,
    student: s.user.student,
  }));

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!isSSR) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const [checkapp, setCheckApp] = useState(false);

  const [isAuthenticated, setAuthenticated] = useState(false);

  const updateDevice = useCallback(() => {
    dispatch(
      updateUserDevice({
        fcmToken: window.fcmToken,
        lastAccessedAt: new Date(),
      }),
    );
  }, [dispatch]);

  const loginSuccess = useCallback(
    data => {
      setAuthorizationHeader(data.token);
      token.current = data.token;
      dispatch(requestUserProfileAction());
      // if (!isSSR) {
      //   updateDevice();
      // }
      // dispatch(getUserSurvey());

      // dispatch(getDefaultDataAction());
    },
    [dispatch],
  );

  useEffect(() => {
    if (qtoken) {
      loginSuccess({token: qtoken});
    } else {
      const isvalue = cookies['common-auth-c'];
      // console.log('[cookie] get', isvalue);
      if (isvalue && isvalue !== 'undefined') {
        loginSuccess({token: isvalue});
      } else {
        setCheckApp(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginSuccess]);

  useEffect(() => {
    dispatch(getWebsitePackageAction());
    async function getNavItems() {
      const res = await getFetcher(
        strApiBaseUrl +
          URIS.GET_STRAPI_HEADER +
          `?populate[contact][populate]=*&populate[social][populate]=*&populate[menu_extras][populate]=*&populate[footer][populate][quick_links]=*&populate[footer][populate][firstcolumn]=*&populate[footer][populate][secondcolumn]=*&populate[footer][populate][thirdcolumn]=*&populate[footer][populate][addresses]=*&populate[seo][populate][metaSocial]=*`,
      );
      setNavBarLinks(res.data.attributes);
    }
    getNavItems();
  }, [dispatch]);

  const toast = useToast();

  const logout = useCallback(
    (e, skipApi = false) => {
      async function logoutfun() {
        if (skipApi === false) {
          LoadingRef.current.show();
          const res = await apis.logoutApi();
          LoadingRef.current?.hide();

          if (res.ok) {
            toast({
              status: 'success',
              title: 'Logout Success!',
              position: 'top',
            });
          }
        }

        setAuthenticated(false);
        // localStorage.removeItem('@login/coco/public');
        if (hostname === 'localhost') {
          removeCookie('common-auth-c');
          console.log('[cookie] remove', 'localhost');
        } else {
          removeCookie('common-auth-c', {domain: '.' + hostname});
          console.log('[cookie] remove', '.' + hostname);
        }
        removeCookie('common-auth-c');
        console.log('[cookie] remove all');
        // console.log("hostname remove cookie")
        removeAuthorizationHeader();
        dispatch(logoutAction(skipApi));
        // history.push('/');
      }
      logoutfun();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast, dispatch, removeCookie],
  );

  //to check cookie
  useEffect(() => {
    const focus = () => {
      // const tokens = cookies["common-auth-c"] //localStorage.getItem(TOKEN_STORAGE_KEY);
      const isExist = document.cookie.includes('common-auth-c');
      console.log('focus listener');
      if (!isExist) {
        console.log('focus listener no token');
        logout(null, true);
        toast({
          title: 'logged out',
          status: 'warning',
          description: 'You have been logged out in another window',
          position: 'bottom',
          duration: 1000,
        });
      }
    };
    if (user) {
      console.log('focus listener user check');
      window.addEventListener('focus', focus);
    } else {
      console.log('focus listener no user');
    }
    return () => {
      window.removeEventListener('focus', focus);
    };
  }, [logout, toast, user]);

  const getPackageContent = useCallback(
    s => {
      if (
        s?.packages.length ||
        s?.trials?.length ||
        student?.trials?.length ||
        student?.packages?.length
      ) {
        let packages = s?.packages || student.packages || [];
        const trials = s?.trials || student.trials;
        const trialPackages =
          trials?.map(t => ({package: t.packageId, _id: t.packageId._id})) ||
          [];
        // console.log({trialPackages});
        const pkgs = _.unionBy([...packages, ...trialPackages], '_id');
        let courseIds = _.chain(pkgs)
          .flatMap(p => p?.package?.courses)
          .compact()
          .value();

        // console.log({courseIds});
        let testIds = _.chain(pkgs)
          ?.flatMap(p => p?.package?.tests)
          .flatMap(t => t?.test)
          .compact()
          .value();

        let assignmentIds = _.chain(pkgs)
          .flatMap(p => p?.package?.assignments)
          .flatMap(t => t?.assignmentId)
          .compact()
          .value();

        dispatch(
          getPkgContentsAction({
            courseIds,
            testIds,
            assignmentIds,
            studentId: s?._id || student?._id,
            slim: true,
          }),
        );
        dispatch(requestCourseTrackingsAction({courseIds: courseIds}));
      }
    },
    [dispatch, student?._id, student?.packages, student?.trials],
  );

  // const getTrialContents = useCallback(
  //   trials => {
  //     if (trials?.length) {
  //       const activeTrials = _.filter(trials, t =>
  //         moment(t.expireOn).isSameOrAfter(moment()),
  //       );
  //       const pkgs = activeTrials.map(t => t.packageId);
  //       let courseIds = _.chain(pkgs)
  //         .flatMap(p => p.courses)
  //         .compact()
  //         .value();
  //       let testIds = _.chain(pkgs)
  //         ?.flatMap(p => p.tests)
  //         .flatMap(t => t?.test)
  //         .compact()
  //         .value();
  //       let assignmentIds = _.chain(pkgs)
  //         .flatMap(p => p.assignments)
  //         .flatMap(t => t?.assignmentId)
  //         .compact()
  //         .value();

  //       console.log();
  //       dispatch(
  //         getTrialPkgContentsAction({
  //           courseIds,
  //           testIds,
  //           assignmentIds,
  //           studentId: student?._id,
  //           slim: true,
  //         }),
  //       );
  //     }
  //   },
  //   [dispatch, student?._id],
  // );

  useCheckStatus({
    status,
    onSuccess: () => {
      setAuthenticated(true);
      setCheckApp(true);
      if (hostname === 'localhost') {
        setCookie('common-auth-c', token.current);
        console.log('[cookie] set', 'localhost');
      } else {
        setCookie('common-auth-c', token.current, {domain: '.' + hostname});
        console.log('[cookie] set ', '.' + hostname, token.current);
      }
      if (!isSSR) {
        updateDevice();
      }
      dispatch(getDefaultDataAction({instituteId: '1'}));
      getPackageContent();
      dispatch(getUserSurvey());
      // dispatch(getWishlistAction());
    },
    onError: () => {
      logout();
      setCheckApp(true);
    },
  });

  const value = useMemo(
    () => ({
      navBarLinks,
      isAuthenticated,
      logout,
      checkapp,
      loginSuccess,
      updateDevice,
      getPackageContent,
      // getTrialContents,
    }),
    [
      // getTrialContents,
      getPackageContent,
      checkapp,
      isAuthenticated,
      loginSuccess,
      logout,
      updateDevice,
      navBarLinks,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {/* <Helmet> */}
      {/* <script type="text/javascript">{
        `var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || {widgetcode:"c19b8953a277983af9301cd7bd19c01eed56e3545b3fb364381d9db86caee1f8a74f7cdd662899779f0d8ba863348e45", values:{},ready:function(){}};var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;s.src="https://salesiq.zoho.in/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);d.write("<div id='zsiqwidget'></div>");`
      }</script> */}
      {/* </Helmet> */}
      {children}
      <LoadingPage ref={LoadingRef} />
    </AppContext.Provider>
  );
};

export const ExamAppProvider = ({children, serverToken}) => {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    if (serverToken) {
      setAuthorizationHeader(serverToken);
      return true;
    } else {
      return false;
    }
  });

  const toast = useToast();

  const logout = useCallback((e, skipApi = false) => {
    async function logoutfun() {
      setAuthenticated(false);
    }
    logoutfun();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      logout,
    }),
    [isAuthenticated, logout],
  );

  const closeWindow = () => {
    console.log('hello');
    window.close();
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'auth',
        message: 'Not authorized',
      }),
    );
  };

  console.log('isAuthenticated', isSSR, isAuthenticated);
  return (
    <AppContext.Provider value={value}>
      {!isAuthenticated && !isSSR ? (
        <Center flexDirection="column" p={10}>
          <Text>Not Authenticated, try again</Text>
          <Button
            mt={10}
            onClick={closeWindow}
            variant="link"
            colorScheme={'red'}>
            {' '}
            Exit{' '}
          </Button>
        </Center>
      ) : (
        children
      )}
      <LoadingPage ref={LoadingRef} />
    </AppContext.Provider>
  );
};

export const LoadingRef = React.createRef();

const logoutRef = React.createRef();

const LoadingPage = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('Please Wait..');
  const toast = useToast();
  const {logout, updateDevice} = useAppContext();

  useImperativeHandle(ref, () => ({
    updateDevice,
    logoutForce: m => {
      if (Date.now() - logoutRef.current > 10000) {
        toast({
          id: 'tforcelogout',
          title: 'Logout',
          description:
            'Unauthorized or you account has been logged in some other device ',
          status: 'error',
          position: 'bottom',
          duration: 1000,
        });
        logout(null, true);
        logoutRef.current = Date.now();
      }
    },
    show: m => {
      setVisible(true);
      setMessage(m || 'Please Wait...');
    },
    hide: () => {
      setVisible(false);
      setMessage('Please Wait...');
    },
    setMessage: m => {
      setMessage(m);
    },
    showToast: config => {
      toast(config);
    },
  }));
  return (
    visible && (
      <Center
        bg="rgba(255,255,255,0.8)"
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="fixed">
        <Spinner colorScheme="telegram" size="xl" />
      </Center>
    )
  );
});
