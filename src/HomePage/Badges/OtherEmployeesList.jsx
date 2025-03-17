
import React, {Fragment, useState} from "react"
import {Navigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import OtherEmployees from "./OtherEmployees";
import Silver from "../../Assets/Silver.jpeg"
import Gold from "../../Assets/Gold.jpeg"
import Bronze from "../../Assets/Bronze.jpeg"
import axios from "axios";
import Loader from "../../Assets/Loader";

const people = [
    {
      name: 'Leslie Alexander',
      email: 'leslie.alexander@example.com',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Michael Foster',
      email: 'ksekhar@middlewaretalents.com',
      role: 'Co-Founder / CTO',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Dries Vincent',
      email: 'dries.vincent@example.com',
      role: 'Business Relations',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: null,
    },
    {
      name: 'Lindsay Walton',
      email: 'lindsay.walton@example.com',
      role: 'Front-end Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'naveen',
      email: 'naveen@middlewaretalents.com',
      role: 'Designer',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
      name: 'Tom Cook',
      email: 'krupasekhar124@gmail.com',
      role: 'Director of Product',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: null,
    },
  ]


const OtherEmployeesList=props=>{
  const [personToGiveBadge, setPersonToGiveBadge]=useState([{name:"",
    email:""}
  ])
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comments, setComments]=useState();
  const [loading, setLoading]=useState(false);

  // Array of image sources (you can customize this as needed)
  const images = [
    Gold,
    Silver,
    Bronze,
  ];

  const submitBadge=async(e)=>{
    setLoading(true);
    e.preventDefault();
    await axios.post("https://msquirebackend.azurewebsites.net/apis/employees/badges/AddBadges", {
      assignedPersonEmail:localStorage.getItem("email"),
      personName:personToGiveBadge[0].name,
      personEmail:personToGiveBadge[0].email,
      badgeName:selected,
      comments:comments
    });

    setIsOpen(false);
    setLoading(false);
  }

  const badgeCreate=(email)=>{
    console.log(email)   //Used to create badge
    if(!isOpen){
        const onePerson=people.filter(each=>
            each.email===email    //Used to filter person to assign badge
        )

        setPersonToGiveBadge(onePerson)
        console.log(personToGiveBadge)
        setIsOpen(true);
    }
    else{
        setIsOpen(false)
    }
}
const isLoggedIn = localStorage.getItem('email');
console.log(isLoggedIn)
if (isLoggedIn===null){
    return <Navigate to="/login"/>
};



       return <div>
        {loading && <Loader/>}
        <div className="my-8 flex items-center text-4xl text-black-500">
        You can give badges For Following Employees:
                    </div>
        <ul  className="divide-y divide-gray-100">                {/* This Function returns Team */}
        {people.map((member) => (
          <OtherEmployees badgeCreate={badgeCreate} member={member}/>
        ))}
      </ul>

      <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto overflow-x-auto">
          <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-full w-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Adding Badge
                </Dialog.Title>
                <div className="mt-10 w-lg">
          <form className="space-y-6" onSubmit={submitBadge}>

          <div className="flex flex-col md:flex-row">
          <div className="mr-5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                  Name
                </label>

              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={personToGiveBadge[0].name}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={personToGiveBadge[0].email}

                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                />
              </div>
            </div>
          </div>


             <div>
              <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                Select Badge
              </label>
              <div className="flex space-x-8">
      {images.map((src, index) => (
        <div
          key={index}
          onClick={() => setSelected(index)}
          className={`relative w-32 h-32 overflow-hidden border-2 transition-transform duration-300 flex flex-row space-between mt-5 rounded-full ${
            selected === index ? 'border-blue-500 scale-110' : 'border-transparent'
          }`}
        >
          <img
            src={src}
            alt="img"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      ))}
    </div>
            </div>


            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                  Comments
                </label>

              </div>
              <div className="mt-2">
                <textarea
                  id="comments"
                  name="comments"
                  type="comments"
                  onChange={(event)=> setComments(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                ></textarea>
              </div>
            </div>



            <div>
              <button
                type="submit"

                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add badge
              </button>
            </div>
          </form>
        </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
      </div>



}

export default OtherEmployeesList