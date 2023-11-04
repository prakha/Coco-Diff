import React from "react";
import { renderToString } from "react-dom/server";
import _ from "lodash";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { setupStore } from "../redux";
import { StaticRouter } from "react-router-dom";
import { App } from "../App/index";
import { App as ExamApp } from "../ExamApp/index";

import axios from "axios";
import { CookiesProvider } from "react-cookie";
import { getBaseUrl } from "./baseUrlHelper";
import { ExtraApp } from "../extra_routes";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map((asset) => `<link rel="stylesheet" href="${asset}">`)
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = "") => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map((asset) => `<script src="${asset}"${extra}></script>`)
          .join("")
      : ""
    : "";
};

const urls = [
  "/my/",
  "/coco-support/",
  "/wpblog/page/29/",
  "/wpblog/page/27/",
  "/local/pagecontainer/coco-pathshala/",
  "/local/pagecontainer/login/registration.php",
  "/local/pagecontainer/discussion-community/discussioncommunity.php",
  "/local/pagecontainer/currentaffairs/currentaffair.php?category=Mjg=",
  "/local/pagecontainer/previous_year_paper/download.php?lang=hi",
  "/my",
  "/coco-support",
  "/wpblog/page/29",
  "/wpblog/page/27",
  "/local/pagecontainer/coco-pathshala",
];

export const AppReturnMiddleware = (req, res) => {
  // console.log("hostname ssr", req.universalCookies?.cookies?.["coco-user-cookie"])
  const token =
    req.query.token || req.universalCookies?.cookies?.["coco-user-cookie"];
  const baseUrl = getBaseUrl(req.host);

  if (urls.includes(req.url)) {
    res.redirect(301, "/");
  }

  if (req.url.includes("exam/start") || req.url.includes("exam/report")) {
    const testId = req.query.testId;
    const testAttemptId = req.query.testAttemptId;
    const itoken = req.query.token || token;
    // console.log("returned", testId, testAttemptId, baseUrl);
    if (itoken) {
      ssrAppReturn(req, res, { token: itoken }, "examclient");
    }
    return;
  }

  if (req.url.includes("?dr=")) {
    // console.log("extraclient");
    return ssrAppReturn(req, res, {}, "extraclient");
  }

  axios
    .get(baseUrl + "website/data", { params: { includeUser: true, token } })
    .then(({ data, config, headers }) => {
      ssrAppReturn(req, res, data, "client", req.query.token);
    })
    .catch((error) => {
      console.log({
        title: "Error",
        level: "error",
        message: `Error: "${error}"`,
      });
      // ssrAppReturn(req, res);
      res.send({ error: error });
    });

  // ssrAppReturn(req, res, {
  //   /*some data*/
  // });
};

// <script type="text/javascript" src="/public/js/transliterate/pramukhime.js"></script>
//           <script type="text/javascript" src="/public/js/transliterate/pramukhindic.js"></script>
//           <script type="text/javascript" src="/public/js/transliterate/pramukhindic-i18n.js"></script>

//  <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//     <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

export const ssrAppReturn = (req, res, jsonData, client = "client", token) => {
  const context = {};
  let { storeData, helmetTags } = reactApplicationMiddleware(jsonData, token);
  const store = setupStore(storeData);
  // console.log({ client });
  // console.log(req.universalCookies)
  const markup = renderToString(
    <CookiesProvider cookies={req.universalCookies}>
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Helmet>{helmetTags}</Helmet>
          {client === "extraclient" ? (
            <ExtraApp />
          ) : client === "client" ? (
            <App />
          ) : (
            <ExamApp />
          )}
        </StaticRouter>
      </Provider>
    </CookiesProvider>
  );

  // console.log("context url", context.url, jsScriptTagsFromAssets(assets, "client", " defer crossorigin"),  jsScriptTagsFromAssets(assets, "examclient", " defer crossorigin"))
  if (context.url) {
    res.redirect(context.url);
  } else {
    const helmet = Helmet.renderStatic();

    const htmlAttrs = helmet.htmlAttributes.toString();
    const bodyAttrs = helmet.bodyAttributes.toString();

    const response = `<!doctype html>
          <html lang="en" ${htmlAttrs}>
          <head>
          <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KM58JP9');</script>
<!-- End Google Tag Manager -->

          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel='stylesheet', href='https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css'>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          ${helmet.style.toString()}
          ${helmet.noscript.toString()}
          ${helmet.script.toString()}
          
          ${cssLinksFromAssets(assets, client)}
          <style>
          .noprint {
             visibility: visible;
             display:block;
            }
          .print {
            visibility: hidden;
            display:none;
          }

          @media print {
            .noprint {
               visibility: hidden;
               display: none;
            }
            .print {
              visibility: visible;
              display: block;
           }
         }
         </style>
            </head>
            <body ${bodyAttrs}>
            <h1 style="display:none;">Best Preparation, High-Quality study materials, and Proven Results</h1>
            <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KM58JP9"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

                <div id="root">${markup}</div>
                ${jsScriptTagsFromAssets(assets, client, " defer crossorigin")}

                ${
                  storeData &&
                  ` <script>
                window.__SERVER_DATA__ = ${JSON.stringify(storeData)}
              </script>`
                }
                  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"></script>
                  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js"></script>
                  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.8.335/build/pdf.min.js"></script>
                  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

                  </body>
            </html>`;
    // console.log([response])
    res.status(200).send(response);
  }
};

function reactApplicationMiddleware(body, qtoken) {
  const helmetTags = [
    <title key="title">
      CGPSC Coaching and Courses in Raipur - Competition Community
    </title>,
    <meta
      key="title-meta"
      name="title"
      content={"CGPSC Coaching and Courses in Raipur - Competition Community"}
    />,
    <meta
      key="description"
      name="description"
      content={
        "Competition Community offers online CGPSC Courses, Offline Coaching, and high-quality study materials for CGPSC and other competitive exams"
      }
    />,
    <meta
      key="keywords"
      name="keywords"
      content={[
        "COCO",
        "CGPSE",
        "CHSL",
        "MPSE",
        "ACF",
        "Competition Community",
        "Coco",
      ].join(",")}
    />,
    <meta key="geo.placename" name="geo.placename" content={`India`} />,
    <meta key="geo.region" name="geo.region" content={"CHHATTISGARH"} />,
    <meta key="robots" name="robots" content="index,follow" />,
    <meta key="coverage" name="coverage" content="Worldwide" />,
    <link rel="preconnect" href="https://fonts.googleapis.com" />,
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />,
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap"
      rel="stylesheet"
    ></link>,
  ];
  let storeData;
  // can pass store data from server
  if (!body) {
    storeData = undefined;
  } else {
    storeData = body.token
      ? {
          user: {
            token: body.token,
          },
        }
      : {
          package: {
            packagesList: body.packages,
            config: body.config || {},
            notices: body.notices,
            events: body.events,
          },

          user: {
            user: body.user,
            token: qtoken,
            student: body?.user?.student,
          },
        };
  }
  return { storeData, helmetTags };
}
