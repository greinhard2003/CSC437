import { Schema, Types, model } from "mongoose";
import { Event } from "../models/event";

const EventSchema = new Schema<Event>(
  {
    userid: { type: String, required: true, trim: true },
    eventname: { type: String, required: true, trim: true },
    startdate: { type: String, required: true, trim: true },
    enddate: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
  },
  { collection: "events" }
);

const EventModel = model<Event>("Events", EventSchema);

function index(): Promise<Event[]> {
  return EventModel.find();
}

function get(userid: string): Promise<Event[]> {
  return EventModel.find({ userid: userid })
    .then((list) => list)
    .catch((err) => {
      throw `Error fetching events`;
    });
}

function create(json: Event): Promise<Event> {
  return new EventModel(json).save();
}

function update(id: string, event: Event): Promise<Event> {
  return EventModel.findByIdAndUpdate(id, event, {
    new: true,
    runValidators: true,
    context: "query",
  }).then((updatedEvent) => {
    if (!updatedEvent) {
      throw `${id} Not Updated`;
    }
    return updatedEvent as Event;
  });
}

function remove(id: string): Promise<void> {
  return EventModel.findByIdAndDelete(id).then((deletedUser) => {
    if (!deletedUser) {
      throw `${id} Not Deleted`;
    }
  });
}

export default { index, get, create, remove, update };
