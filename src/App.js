import {
  Box,
  Button,
  ButtonGroup,
  ButtonSpinner,
  CloseButton,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import useRazorpay from "react-razorpay";
import { toast, Toaster } from "react-hot-toast";

import {
  FaLocationArrow,
  FaTimes,
  FaSearchLocation,
  FaSquareParking,
  FaParking,
} from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconBase } from "react-icons";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBGlXicjRiIlIXzN2MAc9NE6WPUuVm76cw",
    libraries: ["places"],
  });

  const [Razorpay] = useRazorpay();

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [originLat, setOriginLat] = useState(null);
  const [originLong, setOriginLong] = useState(null);
  const [reserve, setReserve] = useState(false);
  const [orderID, setOrderID] = useState(null);
  const newPark = { lat: 28.705173, lng: 77.100937 };

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((res) => setOrderID(res["orderID"]["id"]));
  }, []);

  var center = { lat: originLat, lng: originLong };
  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setOriginLat(position.coords.latitude);
    setOriginLong(position.coords.longitude);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  });

  async function calculateRoute() {
    // if (originRef.current.value === "" || destiantionRef.current.value === "") {
    //   return;
    // }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: `${originLat},${originLong}`,
      destination: "28.610413, 77.035938",
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }
  async function reservepark(place) {
    const location = [
      { lat: 28.705525, lng: 77.100444 },
      { lat: 28.705474, lng: 77.101544 },
      { lat: 28.705647, lng: 77.101143 },
    ];
    location.map((lol) => {
      // eslint-disable-next-line no-undef
      new google.maps.Marker({
        position: lol,
        map,
        title: "Hello World!",
      });
    });
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  async function payment() {
    var options = {
      key: "rzp_test_aNYoQ5FgTfdEnR", // Enter the Key ID generated from the Dashboard
      amount: 5000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Pragati",
      description: "Test Transaction",
      image:
        "https://img.pikbest.com/png-images/online-education-learning-vector-graphic-element_1532815.png!bw700",
      order_id: orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        toast.success("Payment successfull");
      },
      theme: {
        color: "#f26e61",
      },
    };

    // eslint-disable-next-line no-undef
    var rzp1 = new Razorpay(options);
    // console.log(rzp1);
    rzp1.on("payment.failed", function (response) {
      toast.error(response.error.code);
      toast.error(response.error.description);
      toast.error(response.error.source);
      toast.error(response.error.step);
      toast.error(response.error.reason);
      toast.error(response.error.metadata.order_id);
      toast.error(response.error.metadata.payment_id);
    });

    rzp1.open();
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {/* <Marker position={newPark} /> */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <HStack spacing={5} justifyContent="space-around">
          <ButtonGroup justifyContent="space-between">
            <Button colorScheme="blue" type="submit" onClick={calculateRoute}>
              Find Parking
            </Button>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Reserve Parking
            </Button>
            <Button colorScheme="orange" type="submit" onClick={calculateRoute}>
              Other Modes
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Autocomplete>
            <input
              style={{
                outline: "none",
                border: "1px solid grey",
                borderRadius: "5px",
              }}
            />
          </Autocomplete>
          <IconButton
            aria-label="center back"
            icon={<FaSearchLocation />}
            isRound
            onClick={() => {
              const relocate = { lat: 28.705173, lng: 77.100937 };
              map.panTo(relocate);
              map.setZoom(19);
              reservepark(relocate);
            }}
          />
        </HStack>
        <HStack>
          <div>
            <IconButton aria-label="center back" icon={<FaParking />} />
            <span>₹50</span>
            <div>
              <Button onClick={payment}>Pay</Button>
            </div>
          </div>
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
