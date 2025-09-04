import React from "react";
import Firstpage from "./firstcard";
import SecondCard from "./secondcard";
import Thirdcard from "./thirdcard";

// import Ads from "./newsad";

// import Slider from "./sliderImages/CarouselSlider";

function Home() {
  return (
    <div className="App">
      <Firstpage />
      <SecondCard />
      <Thirdcard />
    </div>
  );
}

export default Home;
