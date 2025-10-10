import { NavLink } from "react-router";


function AboutPage() {
  return ( 
    <div className=" text-3xl">

      <div className="flex">
        <NavLink to='/'>Main</NavLink>      
      </div>

      <div>About Page</div>
    </div>
  );
}

export default AboutPage;