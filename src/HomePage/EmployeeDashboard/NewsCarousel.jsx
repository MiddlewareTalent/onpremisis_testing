import { useState, useEffect, useContext } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import axios from 'axios'
import { MyContext } from '../../MyProvider/MyProvider';

// Sample news data


export default function NewsCarousel() {
  const [newsData, setNewsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const { state } = useContext(MyContext);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get('https://msquirebackend.azurewebsites.net/apis/employees/companyNews/getAllNews', {
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        console.log(response.data);
        setNewsData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  let currentNews;
  let isFirstNews;
  let isLastNews;


  if (newsData !== null) {
    currentNews = newsData[currentIndex]
    isFirstNews = currentIndex === 0
    isLastNews = currentIndex === newsData.length - 1
  }

  const deleteNews=async(id)=>{
    const token = localStorage.getItem("token");
    try{
      axios.delete(`https://msquirebackend.azurewebsites.net/apis/employees/companyNews/deleteNewsById/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
        }
      })
    }
    catch(e){
      console.log(e);
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get('https://msquirebackend.azurewebsites.net/apis/employees/companyNews/getAllNews', {
          headers: {
            "Authorization": `Bearer ${token}`  // Add the token to the Authorization header
          }
        });
        console.log(response.data);
        setNewsData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    setCurrentIndex(0);

  }




  return (
    <div className="flex flex-col items-center justify-center">
      {newsData !== null && newsData.length > 0 && (
        <div className="flex justify-between w-full max-w-2xl mt-4">
          {!isFirstNews && (
            <button
              onClick={goToPrevious}
              className="flex items-center px-4 py-2 text-black border border-solid border-black rounded-md transition-colors"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
            </button>
          )}
          <div className="flex-grow" /> {/* This div will take the remaining space */}
          {!isLastNews && (
            <button
              onClick={goToNext}
              className="flex items-center px-4 py-2 text-black border border-solid border-black rounded-md transition-colors"
            >
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      )}

      {newsData !== null && newsData.length > 0 && <div className="bg-slate-100 p- mt-5 shadow-md rounded-lg w-full max-w-2xl overflow-hidden">
        <div className="p-6 ">
          {newsData.length > 0 && <h2 className="text-2xl font-bold mb-2">{currentNews.newsHeading}</h2>}
          {newsData.length > 0 && <p className="text-gray-600">{currentNews.news}</p>}
        </div>

      </div>}
      {newsData.length>0 && state.employeeId===currentNews.userId && 
      <button
      type="button"
      onClick={()=>deleteNews(currentNews.newsId)}
      className="inline-flex items-end mt-5 rounded-md bg-indigo-600 px-3 py-2 text-xl font-semibold text-white bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >Delete News
    </button>}
    </div>
  )
}