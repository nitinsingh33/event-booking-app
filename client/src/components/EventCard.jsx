const EventCard = ({ event }) => {
    return (
        <div classname="bg-white p-4 rounded-x1 shadow-md hover:shadow-lg transition">
            <h2 classname="text-xl font-semibold mb-2">{event.title}</h2>
            <p classname="text-gray-600 text-sm mb-2">{event.date}</p>
            <p classname="text-gray-700 mb-4">{event.description}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Now</button>
        </div>
    );
};

export default EventCard;