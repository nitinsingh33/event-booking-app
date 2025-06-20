const EventCard = ({ event }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-200">
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-800">{event.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{event.date}</p>
        <p className="text-gray-600 mt-2 text-sm">{event.description}</p>
        <button className="mt-4 bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
