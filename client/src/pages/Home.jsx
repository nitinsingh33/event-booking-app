// src/pages/Home.jsx
import EventCard from '../components/EventCard';

const Home = () => {
    const events = [
        {
            id: 1,
            title: "IIT Patna Hackathon",
            date: "25 June 2025",
            description: "48-hour coding sprint with exciting",   
        },
        {
            id: 2,
            title: "Tech Talk: AI & Future",
            date: "5 July 2025",
            description: "Industry leaders share insights on AI trends",
        },
        {
            id: 3,
            title: "Startup Pitch Fest",
            date: "12 August 2025",
            description: "Pitch your startup idea to real investors.",
        },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h1>
            <div classname="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default Home;
