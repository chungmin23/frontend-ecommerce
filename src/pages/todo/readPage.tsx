import { useParams } from "react-router";


function ReadPage() {

  const {tno} = useParams()

  console.log(tno)

  return ( 
    <div className="bg-white w-full">
      <div className="text-4xl">Todo Read Page  {tno}</div>
    </div>
   );
}

export default ReadPage;