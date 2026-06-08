import styles from '../../styles/styles'
import EventCard from './EventCard.jsx'
import { useSelector } from 'react-redux'

function Events() {
  const { allEvents, isLoading } = useSelector((state) => state.events)

  return (
    <div>
      {!isLoading && allEvents && allEvents.length > 0 && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid gap-6">
            {allEvents.map((event, index) => (
              <EventCard key={event._id || index} data={event} active={index === 0} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
