import React from "react";
import { actions, connect, IGlobalState } from "../Store";
import "./Meta.css";

export interface IMetaProps {
  isPlaying: boolean;
  album?: string;
  artist?: string;
  track?: string;
}

interface IMetaState {
  interval?: number;
}

export class Meta extends React.Component<IMetaProps, IMetaState> {
  state: IMetaState = {};

  componentDidMount() {
    actions.fetchMeta();
    const interval = window.setInterval(actions.fetchMeta, 2000);
    this.setState({
      interval
    });
  }

  componentWillUnmount() {
    const { interval } = this.state;

    if (interval) {
      clearInterval(interval);
    }
  }

  render() {
    const { isPlaying, album, artist, track } = this.props;

    return (
      <div className="Meta">
        {isPlaying &&
          artist &&
          `${artist || "N/A"} - ${track || "N/A"}<br />${album || "N/A"}`}
      </div>
    );
  }
}

const mapStateToProps = ({
  isPlaying,
  meta: { artist, album, track }
}: IGlobalState) => ({
  album,
  artist,
  isPlaying,
  track
});

export default connect(mapStateToProps)(Meta);
