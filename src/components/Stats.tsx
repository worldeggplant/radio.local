import React from "react";
import { actions, connect, IGlobalState } from "../Store";
import "./Stats.css";

export interface IStatsProps {
  listeners?: number;
}

export interface IStatsState {
  interval?: number;
}

export class Stats extends React.Component<IStatsProps> {
  state = { interval: null };

  componentDidMount() {
    actions.fetchStats();
    const interval = window.setInterval(actions.fetchStats, 2000);
    this.setState({ interval });
  }

  render() {
    const { listeners } = this.props;

    if (listeners === null) {
      return null;
    }

    return (
      <div className="Stats">
        {listeners} listener{listeners === 1 ? "" : "s"}
      </div>
    );
  }
}

const mapStateToProps = ({ stats: { listeners } }: IGlobalState) => ({
  listeners
});

export default connect(mapStateToProps)(Stats);
