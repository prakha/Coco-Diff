import React, { useEffect, useState } from "react";

import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import {
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  OrderedList,
  ListItem,
  UnorderedList,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { apiClient } from "../services/api";
import { useQueryParams } from "../utils/useQueryParams";
import moment from "moment";
import { BaseURL } from "../BaseUrl";
// import { useDispatch } from "react-redux";

export const DownloadRoll = (props) => {
  // const dispatch = useDispatch()
  const query = useQueryParams();
  const rollNo = query.get("dr");
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(
        BaseURL + "package/package-roll-details?roll=" + rollNo
      );
      if (res) {
        console.log({ res });
        setData(res.data);
      }
    };
    getData();
  }, [rollNo]);

  console.log(data?.pkg?.package?.timetable?.url);
  return (
    <Box minW="600pt">
      <Box justifyContent="center" className="noprint" bg="gray.50" p={10}>
        {/* <Heading className="noprint" size="lg" as={"h3"}>
        Competition community (Download Roll no.)
      </Heading> */}
        <br />
        <br />
        <Box p={4}>
          <Button
            colorScheme="green"
            onClick={() => {
              window.print();
            }}
          >
            Print Admit Card
          </Button>

          {data?.pkg?.package?.timetable ? (
            <Button
              ml={10}
              colorScheme="orange"
              onClick={() => {
                window.open(data?.pkg?.package?.timetable?.url, "_");
              }}
            >
              Download Timetable
            </Button>
          ) : null}
        </Box>
        <Box w={"600pt"} overflow="auto">
          <AdmitCardComponent data={data} />
        </Box>
      </Box>
      <Box className="print">
        <AdmitCardComponent data={data} />
      </Box>
    </Box>
  );
};
const list = [
  {
    l: "  अभ्यर्थी प्रवेश-पत्र की जाँच कर लें तथा कोई विसंगति पाए जाने पर तत्काल परीक्षा नियंत्रक कम्पटीशन कम्युनिटी बिलासपुर को सूचित करें । उक्त संदर्भ में भेजे जाने वाले अभ्यावेदन/पत्र में  अपना आवेदन क्रमांक, अनुक्रमांक, परीक्षा का नाम एवं वर्ष, श्रेणी तथा जन्मतिथि अवश्य लिखें।",
  },
  {
    l: "प्रवेश-पत्र पर दिए गये परीक्षा केन्द्र के पते के संबंध में अभ्यर्थी परीक्षा तिथि के कम से कम एक दिन पूर्व आश्वस्त हो ले जिससे अभ्यर्थी को परीक्षा के दिन परीक्षा केन्द्र खोजने में कोई परेशानी न हो। परीक्षा केन्द्र न मिल पाने के संबंध में किसी भी प्रकार का अभ्यावेदन कम्पटीशन कम्युनिटी द्वारा स्वीकार नहीं किया जाएगा।",
  },
  {
    l: "परीक्षा केन्द्र परिवर्तन के संबंध में किसी प्रकार का आवेदन कम्पटीशन कम्युनिटी द्वारा स्वीकार नहीं किया जाएगा",
  },
  {
    l: "प्रवेश पत्र तथा फोटो पहचान पत्र की मूल प्रति के बिना किसी भी, अभ्यर्थी को परीक्षा हॉल में प्रवेश नहीं दिया जाएगा।",
  },
  {
    l: "अभ्यर्थी परीक्षा हॉल में परीक्षा प्रारम्भ होने के एक घंटा पूर्व उपस्थित हो, यदि अभ्यर्थी निर्धारित समय के 15 मिनट पश्चात् परीक्षा केन्द्र में उपस्थित होते हैं तो उन्हें परीक्षा में सम्मिलित होने से वंचित किया जा सकेगा।",
  },
  {
    l: "परीक्षा कक्ष में निर्धारित अनुक्रमांक पर ही बैठे एवं उपस्थिति पत्रक और उत्तर पुस्तिका पर निर्धारित स्थान पर हस्ताक्षर करें। ",
  },
  {
    l: "ओ.एम.आर. प्रश्न सह उत्तर पुस्तिका पर समस्त प्रविष्टियाँ नीला /काले बॉल पॉइंट पेन से करनी हैं, अतः अपने साथ अच्छी गुणवत्ता के दो नीले/काले बॉल पॉइंट पेन अवश्य रखें ।",
  },
  {
    l: "परीक्षा में अनुशासनहीनता तथा अनुचित साधनों का प्रयोग करने पर तत्काल आपके विरुद्ध कार्यवाही करते हुए आपको परीक्षा हॉल से निष्काषित किया जाएगा । ऐसी स्थिति में कम्पटीशन कम्युनिटी  अनुशासनात्मक निर्देशों के तहत आपके विरुद्ध कठोर कार्यवाही कर सकेगा, साथ ही अभ्यर्थी के विरुद्ध दाण्डिक कार्यवाही की जाएगी व आपकी अभ्यर्थिता स्वतः निरस्त हो जाएगी । प्रवेश पत्र में किसी भी प्रकार । काट-छांट करना, अपने स्थान पर किसी अन्य व्यक्ति से परीक्षा दिलवाना, परीक्षा कक्ष में किसी अन्य परीक्षार्थी से बात करना, इशारे करना, अन्य परीक्षार्थी की उत्तर पुस्तिका में ताक-झांक करना, परीक्षा कक्ष में चिल्लाना, वीक्षक/केन्द्राध्यक्ष/परीक्षा कार्य में लगे अन्य कर्मचारियों से किसी भी प्रकार का अभद्र व्यवहार करना/धमकाना/शारीरिक चोट पहुँचाना उक्त सभी अनुशासनहीनता की श्रेणी में माने जाएंगे।",
  },
  {
    l: "परीक्षार्थी अपनी पुस्तिका कक्ष के वीक्षक के हाथ में ही सौंपे एवं उनकी अनुमति पश्चात ही कक्ष छोड़ें।",
  },
  // {
  //   l: "जिन अभ्यर्थियों के ऑनलाइन प्रवेश पत्र में उनके फोटो व/या हस्ताक्षर स्पष्ट नहीं है, अनुपलब्ध है या अवैध है ऐसे अभ्यर्थी निम्न प्रक्रिया का अनुसरण करें :",
  //   subs: [
  //     "अपने ऑनलाइन प्रवेश पत्र पर विहित स्थान पर अपना फोटो चिपकाकर उसके नीचे अपने हस्ताक्षर करें ।",
  //     "अपनी फोटो की एक प्रति साथ ले जाएँ । उक्त फोटो के पीछे अपना नाम, एप्लीकेशन नम्बर एवं रोल नंबर अंकित करें, उक्त फोटो वीक्षक/केन्द्राध्यक्ष को उपस्थिति पत्रक पर चिपकाने हेतु सौंप दें।",
  //     "अपने साथ आवेदन पत्र की रसीद की प्रति (जो फार्म जमा करते समय प्राप्त हुई थी) ले जायें तथा मांगे जाने पर वीक्षक को प्रस्तुत करें।",
  //   ],
  // },
  {
    l: "परीक्षा परिणाम तथा अन्य जानकारी हेतु कम्पटीशन कम्युनिटी की वेबसाइट www. Competition community.com का नियमित अवलोकन करें।",
  },
  {
    l: "अभ्यर्थियों के लिए परीक्षा के दौरान कैल्क्यूलेटर, लॉग टेबल, मोबाइल फोन, पेजर, स्मार्ट वॉच तथा किसी भी प्रकार के संचार साधन रखना पूर्णतः प्रतिबंधित है।",
  },
  {
    l: "यदि किसी अभ्यर्थी द्वारा परीक्षा केंद्र में मोबाइल फोन, स्मार्ट वॉच या अन्य कोई संचार साधन लाया जाता है तो उसे परीक्षा कक्ष में प्रवेश करने से पूर्व स्विच ऑफ कर पूर्णतः अपनी जिम्मेदारी पर परीक्षा कक्ष के बाहर रखना होगा । यदि परीक्षा केंद्र में मोबाइल फोन, स्मार्ट वॉच या अन्य कोई संचार साधन चालू अवस्था (ON) में पाया गया तो संबंधित अभ्यर्थी के विरुद्ध अनुचित साधन के प्रयोग का प्रकरण दर्ज किया जायेगा चाहे अभ्यर्थी द्वारा उक्त साधन का प्रयोग किया गया हो अथवा नहीं।",
  },
  {
    l: "केन्द्राध्यक्ष, वीक्षकों तथा परीक्षा कार्य में लगे अन्य अधिकारियों/कर्मचारियों के निर्देशों का पालन करना अनिवार्य है।",
    // subs: [
    //   "सभी अभ्यर्थियों के लिए मास्क/फेस कवर लगाना अनिवार्य है, बिना मास्क/फेस कवर के अभ्यर्थियों को परीक्षा हॉल में प्रवेश नहीं दिया जाएगा।",
    //   "सत्यापन के समय अभ्यर्थियों को परीक्षा कार्य में संलग्न अधिकारियों के निर्देश के अनुसार अपने मास्क को हटाना होगा।",
    //   "परीक्षा हॉल में एवं परीक्षा हॉल के बाहर अभ्यर्थियों को सामाजिक दूरी के नियमों का पालन करना होगा।",
    //   "अभ्यर्थी अपने साथ हैण्ड सैनिटाईजर की छोटी पारदर्शी बॉटल रखें।",
    // ],
  },
];

const AdmitCardComponent = ({ data = {} }) => {
  const user = data?.user;
  const finalRoll = data?.finalRoll;
  const pkg = data?.pkg;

  return !finalRoll ? (
    <Box w="100vw" h="100vh" justifyContent="center" alignItems="center">
      <Spinner size="lg" />
    </Box>
  ) : (
    <HStack>
      <Box background="white" border="1px solid #D6DBDF" p={5}>
        <VStack>
          <Box w={"90%"} h={"50px"}>
            <Image src="/images/admin.png" />
          </Box>
          <Text textAlign="center" fontSize={20} mt={"-10px"} fontWeight={600}>
            {pkg?.package?.altName || "CGPSC MAINS Test Series 2021-22"}
          </Text>
          <Text fontWeight={500} fontSize={16}>
            प्रवेश पत्र/Admit Card
          </Text>

          <Table>
            <Tr>
              <Td
                border="1px solid #AEB6BF"
                fontSize={12}
                textAlign="center"
                colSpan={4}
              >
                यह प्रवेश पत्र तभी मान्य होगा जब अभ्यर्थी द्वारा परीक्षा केंद्र
                में प्रवेश पत्र के साथ निर्देश क्रमांक 4 के अनुरूप वैध फोटो
                पहचान पत्र की मूल प्रति प्रस्तुत की जाएगी । फोटो पहचान पत्र की
                छाया प्रति स्वीकार नहीं की जाएगी ।
              </Td>
            </Tr>
            <Tr>
              <CustomTd>अनुक्रमांक / ROLL NUMBER</CustomTd>
              {data?.pkg?.package?._id === "641810b9e887e71a6d841bb0" ? (
                <CustomTd>परीक्षा की तारीख / DATE OF EXAM</CustomTd>
              ) : (
                <CustomTd>{""}</CustomTd>
              )}

              <CustomTd>समय / TIME</CustomTd>
              <CustomTd>{""}</CustomTd>
            </Tr>
            <Tr>
              <CustomTd>
                <b>{finalRoll}</b>
              </CustomTd>
              {data?.pkg?.package?._id === "641810b9e887e71a6d841bb0" ? (
                <CustomTd>
                  <b>2nd April, 2023</b>
                </CustomTd>
              ) : (
                <CustomTd></CustomTd>
              )}
              <CustomTd>
                {/* <b>{user?.gender}</b> */}
                <b>{data.timing}</b>
              </CustomTd>
              <CustomTd rowSpan={4} width="100px">
                <HStack justifyContent="center" h={"80%"}>
                  <HStack
                    align="center"
                    w="80%"
                    h="100%"
                    background={user.avatar ? "white" : "gray.400"}
                    color="white"
                    justifyContent="center"
                    border="1px solid #AEB6BF"
                  >
                    {user?.avatar ? (
                      <Image
                        h="100%"
                        w="100%"
                        src={user.avatar || "/images/user.webp"}
                        objectFit="cover"
                      />
                    ) : (
                      <Text>
                        Paste Image <br /> Here
                      </Text>
                    )}
                  </HStack>
                </HStack>
              </CustomTd>
            </Tr>
            <Tr>
              <CustomTd>अभ्यर्थी का नाम / Examinee's Name:</CustomTd>
              <CustomTd colSpan={2}>
                <b>{user?.name}</b>
              </CustomTd>
            </Tr>
            <Tr>
              <CustomTd>संपर्क नंबर / Contact Number:</CustomTd>
              <CustomTd colSpan={2}>
                <b>{user.contact}</b>
              </CustomTd>
            </Tr>
            <Tr>
              <CustomTd>केंद्र कोड / Exam Center Code:</CustomTd>
              <CustomTd colSpan={2}>
                <b>{pkg?.center?.code}</b>
              </CustomTd>
            </Tr>
            <Tr>
              <CustomTd rowSpan={2}>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;परीक्षा केंद्र का
                नाम व पता /<br /> Exam Center Name & Address:
              </CustomTd>

              <CustomTd colSpan={2} rowSpan={2}>
                <b>
                  {pkg?.center?.name}
                  <br />
                  {pkg?.center?.address}
                </b>
              </CustomTd>
              <CustomTd p={12}></CustomTd>
            </Tr>
            <Tr>
              <CustomTd>अभ्यर्थी के हस्ताक्षर / Candidate's Signature</CustomTd>
            </Tr>
          </Table>
          <br />
          <Box p={2} fontSize={9} border="1px solid #AEB6BF">
            महत्त्वपूर्ण निर्देश
            <OrderedList>
              {list.map((d) => (
                <ListItem key={d}>
                  {d.l}
                  {d.subs ? (
                    <UnorderedList>
                      {d.subs.map((sub) => (
                        <ListItem key={sub}>{sub}</ListItem>
                      ))}
                    </UnorderedList>
                  ) : null}
                </ListItem>
              ))}
            </OrderedList>
            <b>
              प्रवेश पत्र से सम्बंधित किसी भी अन्य प्रकार की सहायता हेतु आप +91
              9993555585 पर कॉल करें |
            </b>
          </Box>
          {data?.pkg?.package?._id === "63c29a6048bd9c9ec4cdb817" ? (
            <Box>
              <Heading fontSize="xs">नोट:-</Heading>
              <Heading fontSize="xs">
                1. कृपया आप परीक्षा में शामिल होने हेतु अपने साथ Writing Pad/
                Cardboard आवश्यक रूप से लेकर आये ताकि आपको OMR Sheet भरने में
                कोई समस्या न हो|
              </Heading>
              <Heading fontSize="xs">
                2. परीक्षार्थियों की संख्या अधिक होने के कारण परीक्षा का आयोजन 2
                पालियों (Time Slot) में किया जायेगा, अतः आप सभी Exam Center में
                आने से पूर्व अपना Exam Time Slot आवश्यक रूप से देख लेवें।
              </Heading>
            </Box>
          ) : null}
        </VStack>
      </Box>
    </HStack>
  );
};

const CustomTd = ({ children, textAlign, p, ...rest }) => {
  return (
    <Td
      p={0}
      h={30}
      border="1px solid #AEB6BF"
      fontSize={10}
      {...rest}
      textAlign={textAlign || "center"}
    >
      {children}
    </Td>
  );
};
