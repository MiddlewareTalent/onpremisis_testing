import { PlusIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Silver from "../../Assets/Silver.jpeg"
import Gold from "../../Assets/Gold.jpeg"
import Bronze from "../../Assets/Bronze.jpeg"
import Loader from "../../Assets/Loader";
import Empty from "../../Assets/Empty.svg";

const GivenBadges=()=>{

    const [badgesData, setBadgesData]=useState([]);
    const [loading, setLoading]=useState(false);

    useEffect(() => {
      setLoading(true);
        const fetchData = async () => {
            const email=localStorage.getItem('email');
          try {
            const response = await axios.get(`https://msquirebackend.azurewebsites.net/apis/employees/badges/BadgesAssignedBy/${email}`);
            console.log(response.data);
            setBadgesData(response.data.reverse());
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
      }, []);

    const badgeImage=(badgeName)=>{
        if(badgeName==="0"){
            return <img className="h-36" alt="gold" src={Gold}/>
        }
        else if(badgeName==="1"){
            return <img className="h-36" alt="silver" src={Silver}/>
        }
        else {
            return <img className="h-36" alt="bronze" src={Bronze}/>
        }
    }



return <div className="flex flex-col">
  {loading && <Loader/>}
<div className="pt-5 p-6">
    <h2 className="text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-5xl sm:tracking-tight">
        Given Badges
    </h2>
    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                    <div className="mt-2 flex items-center text-2xl text-gray-500">

                        Below is a list of all badges given by you. You can give more badges by clicking on Give Badge.
                    </div>
                    <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="sm:ml-3">
                    <Link to="/OtherEmployeesList">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-8 w-8" aria-hidden="true"/>
                        Give Badge
                    </button>
                    </Link>
                </span>
                    </div>
                </div>
</div>


  {!loading && badgesData.length===0 && <img className='h-80 self-center ml-auto mr-auto mt-40' src={Empty} alt="No data found"/>}
  <div className="mt-6 ml-5 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
    {badgesData.length!==0 && badgesData.map((badge) => (
      <div key={badge.id} className="group relative">
        <div className="pl-5 aspect-h-1 aspect-w-1 w-full overflow-auto rounded-md border border-solid border-slate-200 shadow-md  lg:aspect-none group-hover:opacity-75 lg:h-80">
        <div className="mt-4 flex flex-row">
          <div>
            <p className=" mr-2 text-xl text-gray-500">To:</p>
          </div>
          <p className="text-xl font-medium text-gray-900">{badge.personName}</p>
        </div>
                <div className="flex justify-center">
                {badgeImage(badge.badgeName)}
                </div>
                <div className="mt-4 flex flex-row">
          <div>
            <p className=" mr-2 text-xl text-gray-500">Comment:</p>
          </div>
          <p className="text-xl font-medium text-gray-900">{badge.comments}</p>
        </div>
      </div>

        </div>

    ))}
  </div>

</div>
}

export default GivenBadges;