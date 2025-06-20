// app/components/TimelineView.tsx
'use client';

import React from 'react';
import Timeline from 'react-calendar-timeline';

import moment from 'moment';
import './styles/Timeline.scss';
export type Stop = {
  name: string;
  type: string;
  time: string; // ISO format or hh:mm
  duration?: number; // minutes
  assigned_to?: string;
};

type Props = {
  stops: Stop[];
};

export default function TimelineView({ stops }: Props) {
  // Extract unique cleaners
  const uniqueCleaners = Array.from(new Set(stops.map(stop => stop.assigned_to || 'Driver')));

  // Map cleaners to groups
  const groups = uniqueCleaners.map((cleaner, idx) => ({
    id: idx + 1,
    title: cleaner,
  }));

  // Create a mapping from cleaner to group ID
  const cleanerGroupMap = Object.fromEntries(groups.map(g => [g.title, g.id]));

  // Convert stops to timeline items
  const items = stops.map((stop, idx) => {
    const start = moment(stop.time, moment.ISO_8601).toDate();
    const duration = stop.duration ?? 30; // Default to 30 min
    const end = new Date(start.getTime() + duration * 60000);
    const groupId = cleanerGroupMap[stop.assigned_to || 'Driver'];

    return {
      id: idx + 1,
      group: groupId,
      title: `${stop.name} (${stop.type})`,
      start_time: start,
      end_time: end,
      className: `timeline-${stop.type}`,
    };
  });

  return (
    <div className="my-10">
<Timeline
  groups={groups}
  items={items}
  defaultTimeStart={moment('2025-06-17T06:00:00').toDate().valueOf()}
  defaultTimeEnd={moment('2025-06-17T20:00:00').toDate().valueOf()}
  timeSteps={{
  second: 0,
  minute: 0,
  hour: 1,
  day: 0,
  month: 0,
  year: 0,
}}
 
/>
    </div>
  );
}
