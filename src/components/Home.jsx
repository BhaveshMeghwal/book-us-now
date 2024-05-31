import React, { useEffect, useState } from 'react'
import './Home.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Mousewheel} from 'swiper/modules';

import UpcomingEvents from './UpcomingEvents';
import Loading from './Loader'

const PAGE_NUMBER = 1;
const TOTAL_PAGES = 5;

const Home = () => {

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(PAGE_NUMBER);


    const fetchApiData = async (type, page) => {
        let API = `https://gg-backend-assignment.azurewebsites.net/api/Events?code=FOX643kbHEAkyPbdd8nwNLkekHcL4z0hzWBGCd64Ur7mAzFuRCHeyQ==&type=${type}&page=${page}`;
        try {
            const res = await fetch(API);
            const data = await res.json();
            return data.events;
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const upcoming = await fetchApiData('upcoming', page);
            const recommended = await fetchApiData('reco');
            setUpcomingEvents((prev) => {
                return [...prev, ...upcoming];
            });
            setRecommendedEvents(recommended);
            setLoading(false);
        };
        if (page <= TOTAL_PAGES) {
            loadEvents();
        }
    }, [page])
    const getDriveFileId = (url) => {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScroll = async () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight && page < 5
        ) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <>
            <div className='hero-section'>
                <h1>Discover Exciting Events Happening Near You - Stay Tuned for Updates!</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore tempora iusto perferendis facilis vero magnam quidem quis earum quo ipsa, hic quam omnis, labore quos dolorem eos deleniti impedit explicabo! Sint, ducimus id possimus soluta rem quaerat, deleniti consequuntur atque facilis voluptate odit quo!</p>
            </div>

            {/* Starting of Recommended events section */}
            <div className='cards-container'>
                <div className='recommended_events-heading '>
                    Recommended shows<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                </svg>
                </div>
                <Swiper
                    spaceBetween={50}
                    slidesPerView={6}
                    loop={true}
                    mousewheel={true}
                    modules={[Mousewheel]}
                >

                    {/* {loading && <p>Loading more events...</p>} */}
                    {recommendedEvents.map((event, index) => (

                        <SwiperSlide key={index} className="card">
                            <div className='card-content1'>
                                <div className='card-content'>
                                    <p className='event-name'>{event.eventName}</p>
                                    <p className='event-date'>{new Date(event.date).toLocaleDateString()}</p>
                                </div>

                                <div className='card-content '>
                                    
                                    <p className=' content-location'><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                                    </svg> {event.cityName}</p>
                                    <p>{event.weather} | {parseFloat(event.distanceKm).toFixed(0)} km</p>
                                </div>
                            </div>
                            {console.log(`${getDriveFileId(event.imgUrl)}`)}
                            <img src={`https://drive.google.com/thumbnail?id=${getDriveFileId(event.imgUrl)}`} className='card-image' alt="" />
                        </SwiperSlide>
                    ))}
                    {/* </div> */}
                </Swiper>
            </div>
            {/* Ending of Recommended events section */}

            <UpcomingEvents upcomingEvents={upcomingEvents} getDriveFileId={getDriveFileId} />
            {loading && <Loading />}

        </>
    )
}

export default Home