import React from "react";
// import Navbar from "./NavBar";
import Scroll from "./scroll";
import Scrolltext from "./scrolltext";
import About from "./abouthome";
import Table from "./table";
import Card from "./card";
import Ads from "./newsad";

// import Ads from "./newsad";

import Slider from "./sliderImages/CarouselSlider";

function Home() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Scroll />
      <Scrolltext />
      <Ads />
      <About />
      <Table />
      <Card />
      <Slider />
    </div>
  );
}

export default Home;
