import LaneImpl, { Lane } from "../models/lane";

export class LaneService {
  lane: LaneImpl;

  constructor() {
    this.lane = new LaneImpl();
  }

  async create(lane: Lane) {
    try {
      return await this.lane.create(lane);
    } catch (err) {
      throw err;
    }
  }

  async update(lane: Lane) {
    try {
      return await this.lane.update(lane);
    } catch (err) {
      throw err;
    }
  }

  async remove(laneId: number) {
    try {
      return await this.lane.remove(laneId);
    } catch (err) {
      throw err;
    }
  }
}