// Enhanced LeaveCalendar Component
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { getLeaveRequestsByEmployee } from "../../api/leaveRequestApi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parseISO } from "date-fns";
import moment from "moment";

const localizer = momentLocalizer(moment);

const LeaveCalendar = ({ employeeId }) => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const res = await getLeaveRequestsByEmployee(employeeId);
        const leaves = res.data.map((leave) => ({
          id: leave.id,
          title: `${leave.leaveType} (${leave.status})`,
          start: parseISO(leave.startDate),
          end: parseISO(leave.endDate),
          allDay: true,
          resource: leave,
        }));
        setEvents(leaves);
      } catch (err) {
        console.error("Failed to fetch leaves", err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchLeaves();
    }
  }, [employeeId]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#6c757d'; // Default gray
    let borderColor = '#6c757d';

    if (event.title.includes("APPROVED")) {
      backgroundColor = '#198754';
      borderColor = '#198754';
    } else if (event.title.includes("PENDING")) {
      backgroundColor = '#ffc107';
      borderColor = '#ffc107';
    } else if (event.title.includes("REJECTED")) {
      backgroundColor = '#dc3545';
      borderColor = '#dc3545';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        padding: '2px 4px'
      }
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView, view }) => {
    return (
      <div className="rbc-toolbar mb-3">
        <div className="row align-items-center">
          <div className="col-md-4">
            <div className="btn-group" role="group">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => onNavigate('PREV')}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => onNavigate('TODAY')}
              >
                Today
              </button>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => onNavigate('NEXT')}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <h5 className="mb-0 text-primary">{label}</h5>
          </div>
          <div className="col-md-4 text-end">
            <div className="btn-group" role="group">
              <button 
                className={`btn btn-sm ${view === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onView('month')}
              >
                <i className="bi bi-calendar3 me-1"></i>Month
              </button>
              <button 
                className={`btn btn-sm ${view === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onView('week')}
              >
                <i className="bi bi-calendar-week me-1"></i>Week
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading calendar...</span>
        </div>
        <p className="mt-2 text-muted">Loading your leave calendar...</p>
      </div>
    );
  }

  return (
    <div className="leave-calendar-container">
      <div className="row mb-3">
        <div className="col-md-8">
          <h5 className="mb-0">
            <i className="bi bi-calendar3 me-2 text-primary"></i>
            My Leave Calendar
          </h5>
          <small className="text-muted">View your leave requests on the calendar</small>
        </div>
        <div className="col-md-4 text-end">
          <div className="d-flex justify-content-end gap-2 flex-wrap">
            <span className="badge bg-success d-flex align-items-center">
              <span className="rounded-circle bg-white me-1" style={{width: '8px', height: '8px'}}></span>
              Approved
            </span>
            <span className="badge bg-warning text-dark d-flex align-items-center">
              <span className="rounded-circle bg-white me-1" style={{width: '8px', height: '8px'}}></span>
              Pending
            </span>
            <span className="badge bg-danger d-flex align-items-center">
              <span className="rounded-circle bg-white me-1" style={{width: '8px', height: '8px'}}></span>
              Rejected
            </span>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div style={{ height: "500px", padding: "15px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              view={view}
              onView={(newView) => setView(newView)}
              style={{ height: 450 }}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
              }}
              popup
              popupOffset={{ x: 30, y: 20 }}
              tooltipAccessor={(event) => `${event.resource.leaveType} Leave - ${event.resource.status}`}
            />
          </div>
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center mt-4">
          <div className="card border-0 bg-light">
            <div className="card-body py-4">
              <i className="bi bi-calendar-plus fs-2 text-muted d-block mb-2"></i>
              <h6 className="text-muted">No leave requests found</h6>
              <p className="text-muted small mb-3">Start by applying for your first leave</p>
              <button 
                onClick={() => window.location.href = '/apply-leave'}
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-plus-circle me-1"></i>
                Apply for Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar;